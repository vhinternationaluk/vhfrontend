export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  /**
   * Validates an image file (type and size)
   */
  export const validateImageFile = (file: File): { valid: boolean; message?: string } => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return { valid: false, message: 'Only image files are allowed.' };
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { valid: false, message: 'Image must be less than 5MB.' };
    }
    
    return { valid: true };
  };
  