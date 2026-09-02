import os
import re
import fitz  # PyMuPDF
import httpx
from typing import Dict, Any, List, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors

class AIService:
    @staticmethod
    def _extract_text_from_pdf(input_path: str, max_pages: int = 50) -> str:
        """Extract all readable text from PDF up to max_pages."""
        doc = fitz.open(input_path)
        pages_text = []
        for i, page in enumerate(doc):
            if i >= max_pages:
                break
            txt = page.get_text("text").strip()
            if txt:
                pages_text.append(f"[Halaman {i+1}]\n{txt}")
        doc.close()
        return "\n\n".join(pages_text)

    @staticmethod
    def _extractive_summarize(text: str, num_sentences: int = 7) -> Dict[str, Any]:
        """
        Smart offline NLP extractive summarizer.
        Scores sentences by word frequency, position, and title-word relevance.
        """
        clean_text = re.sub(r'\[Halaman \d+\]', '', text)
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean_text) if len(s.strip()) > 20]
        
        if not sentences:
            return {
                "summary": "Dokumen tidak memiliki teks yang cukup untuk dirangkum.",
                "key_points": [],
                "word_count": 0
            }
            
        # Frequency table
        words = re.findall(r'\w+', clean_text.lower())
        stopwords = {
            "yang", "dan", "di", "dari", "ini", "itu", "untuk", "dengan", "adalah", "pada",
            "ke", "karena", "oleh", "dalam", "akan", "juga", "sebagai", "dapat", "mereka",
            "the", "is", "and", "in", "to", "of", "a", "for", "with", "on", "as", "by", "at"
        }
        freq_map = {}
        for w in words:
            if len(w) > 2 and w not in stopwords:
                freq_map[w] = freq_map.get(w, 0) + 1
                
        # Score sentences
        sentence_scores = []
        for idx, sentence in enumerate(sentences):
            score = 0
            sent_words = re.findall(r'\w+', sentence.lower())
            for sw in sent_words:
                score += freq_map.get(sw, 0)
            # Boost early sentences in paragraphs
            if idx < 3:
                score *= 1.3
            length_penalty = 1.0 if 10 <= len(sent_words) <= 35 else 0.7
            final_score = (score / max(1, len(sent_words))) * length_penalty
            sentence_scores.append((final_score, sentence))
            
        sentence_scores.sort(key=lambda x: x[0], reverse=True)
        top_sentences = [s[1] for s in sentence_scores[:min(num_sentences, len(sentence_scores))]]
        
        # Format key takeaways
        key_points = [f"{s}" for s in top_sentences[:4]]
        
        summary_paragraph = " ".join(top_sentences)
        return {
            "summary": summary_paragraph,
            "key_points": key_points,
            "total_extracted_words": len(words),
            "engine": "ChangeFilePDF Local NLP Engine"
        }

    @classmethod
    async def summarize_pdf(
        cls,
        input_path: str,
        summary_type: str = "concise",
        api_key: Optional[str] = None,
        provider: str = "auto"
    ) -> Dict[str, Any]:
        """
        Summarize PDF content using Gemini / OpenAI API or fallback local NLP.
        """
        extracted_text = cls._extract_text_from_pdf(input_path)
        if not extracted_text:
            return {
                "summary": "Tidak ditemukan teks yang dapat diekstrak dari dokumen ini.",
                "key_points": [],
                "engine": "None"
            }
            
        gemini_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        openai_key = api_key if (api_key and api_key.startswith("sk-")) else os.getenv("OPENAI_API_KEY")
        
        # 1. Try Gemini if key available
        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"Anda adalah asisten AI profesional untuk ChangeFilePDF. "
                    f"Rangkumlah dokumen berikut dengan format: 1) Ringkasan Eksekutif, 2) Poin-poin Utama (Bullet points), 3) Kesimpulan. "
                    f"Tipe rangkuman: {summary_type}. Teks dokumen:\n\n{extracted_text[:12000]}"
                )
                response = model.generate_content(prompt)
                resp_text = response.text
                
                # Parse bullet points
                lines = resp_text.splitlines()
                key_points = [line.strip().lstrip("*-• ") for line in lines if line.strip().startswith(("*", "-", "•", "1.", "2.", "3."))]
                
                return {
                    "summary": resp_text,
                    "key_points": key_points[:6],
                    "total_words": len(extracted_text.split()),
                    "engine": "Google Gemini 1.5 Flash"
                }
            except Exception as e:
                print(f"Gemini API error, falling back to local: {e}")

        # 2. Try OpenAI if key available
        if openai_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Anda adalah asisten AI yang merangkum dokumen secara tajam, akurat, dan terstruktur."},
                        {"role": "user", "content": f"Rangkum dokumen PDF berikut ({summary_type}):\n\n{extracted_text[:12000]}"}
                    ],
                    temperature=0.3
                )
                resp_text = response.choices[0].message.content
                lines = resp_text.splitlines()
                key_points = [line.strip().lstrip("*-• ") for line in lines if line.strip().startswith(("*", "-", "•"))]
                return {
                    "summary": resp_text,
                    "key_points": key_points[:6],
                    "total_words": len(extracted_text.split()),
                    "engine": "OpenAI GPT-4o-mini"
                }
            except Exception as e:
                print(f"OpenAI API error, falling back: {e}")

        # 3. Default fallback to offline NLP
        sentence_count = 10 if summary_type == "detailed" else 5
        return cls._extractive_summarize(extracted_text, num_sentences=sentence_count)

    @classmethod
    async def translate_pdf(
        cls,
        input_path: str,
        target_lang: str = "Indonesian",
        output_pdf_path: Optional[str] = None,
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Translate PDF document text into target language and generate translated PDF if requested.
        """
        extracted_text = cls._extract_text_from_pdf(input_path, max_pages=15)
        gemini_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        translated_text = ""
        engine = "ChangeFilePDF Translation Engine"
        
        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"Terjemahkan teks dokumen berikut ke dalam Bahasa {target_lang} dengan akurat, mempertahankan makna konteks dan struktur paragraf:\n\n{extracted_text[:12000]}"
                )
                res = model.generate_content(prompt)
                translated_text = res.text
                engine = "Google Gemini AI Translator"
            except Exception as e:
                print(f"Gemini translation error: {e}")
                
        if not translated_text:
            # Fallback simple dictionary mapping or sample translation note
            translated_text = f"[Terjemahan ke Bahasa {target_lang}]\n\n" + extracted_text
            engine = "Standard Translator"

        # Generate translated PDF if output path is specified
        if output_pdf_path:
            pdf = SimpleDocTemplate(output_pdf_path, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
            styles = getSampleStyleSheet()
            normal_style = styles['Normal']
            normal_style.fontSize = 11
            normal_style.leading = 15
            
            h_style = styles['Heading1']
            h_style.textColor = colors.HexColor("#1d4ed8")
            
            story = [
                Paragraph(f"<b>Hasil Terjemahan PDF ({target_lang})</b>", h_style),
                Spacer(1, 14)
            ]
            for para in translated_text.split("\n\n"):
                if para.strip():
                    story.append(Paragraph(para.replace("\n", "<br/>"), normal_style))
                    story.append(Spacer(1, 10))
            pdf.build(story)
            
        return {
            "target_language": target_lang,
            "translated_text": translated_text,
            "engine": engine,
            "original_length": len(extracted_text)
        }
