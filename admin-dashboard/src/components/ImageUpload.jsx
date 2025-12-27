import { useState, useEffect } from 'react';
import { Upload, X, Star } from 'lucide-react';

const ImageUpload = ({ onImagesChange, onPrimaryChange }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  useEffect(() => {
    onPrimaryChange(primaryImage);
  }, [primaryImage, onPrimaryChange]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      setError('You can only upload a maximum of 3 images.');
      return;
    }
    setError('');

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    });

    if (primaryImage === null && newImages.length > 0) {
      setPrimaryImage(0);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);

    if (primaryImage === index) {
      setPrimaryImage(newImages.length > 0 ? 0 : null);
    } else if (primaryImage > index) {
      setPrimaryImage(primaryImage - 1);
    }
  };

  const handleSetPrimary = (index) => {
    setPrimaryImage(index);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Vehicle Images (up to 3)
      </label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload files</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative group">
            <img src={preview} alt={`preview ${index}`} className="h-24 w-full object-cover rounded-md" />
            <div className="absolute top-0 right-0 flex">
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="p-1 bg-red-500 text-white rounded-full opacity-75 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black bg-opacity-50 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleSetPrimary(index)}
                className={`flex items-center text-xs px-2 py-1 rounded ${primaryImage === index ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                <Star size={12} className="mr-1" />
                {primaryImage === index ? 'Primary' : 'Set Primary'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;