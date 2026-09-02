import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 minutes timeout for heavy OCR or conversions
});

export const processPdfTool = async (endpoint, formData, onUploadProgress) => {
  try {
    const response = await apiClient.post(endpoint, formData, {
      responseType: 'blob',
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });

    const contentType = response.headers['content-type'] || '';
    
    // Check if server returned JSON inside Blob (e.g. error or structured diff/analysis)
    if (contentType.includes('application/json')) {
      const text = await response.data.text();
      const jsonData = JSON.parse(text);
      return {
        type: 'json',
        data: jsonData,
      };
    }

    // Extract filename from Content-Disposition header if present
    let filename = 'download';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.includes('filename=')) {
      const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Create a downloadable blob URL
    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = window.URL.createObjectURL(blob);

    return {
      type: 'file',
      downloadUrl,
      filename,
      blob,
      size: blob.size,
      contentType,
    };
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.detail || 'Terjadi kesalahan saat memproses file.');
      } catch (e) {
        throw new Error('Gagal memproses file pada server.');
      }
    }
    throw new Error(error.message || 'Koneksi ke backend gagal. Pastikan server aktif.');
  }
};

export const checkHealth = async () => {
  try {
    const res = await apiClient.get('/api/system/health');
    return res.data;
  } catch (e) {
    return { status: 'offline' };
  }
};

export default apiClient;
