export const uploadShareImage = async (imageBlob: Blob): Promise<string> => {
  // Using imgbb as a free image hosting service
  // You can also use Cloudinary, Imgur, or your own storage
  const formData = new FormData();
  formData.append('image', imageBlob);
  
  try {
    // Using a free image hosting API (imgbb)
    // Replace with your own API key or storage solution
    const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};

// Alternative: Convert blob to base64 data URL (inline, but large)
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
