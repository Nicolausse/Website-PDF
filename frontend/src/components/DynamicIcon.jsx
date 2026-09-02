import React from 'react';
import * as Icons from 'lucide-react';

export const DynamicIcon = ({ name, className = "w-6 h-6", ...props }) => {
  const IconComponent = Icons[name] || Icons.FileText;
  return <IconComponent className={className} {...props} />;
};

export default DynamicIcon;
