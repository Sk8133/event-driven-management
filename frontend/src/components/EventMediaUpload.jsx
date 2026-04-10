import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Video, Play, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

/**
 * EVENT MEDIA UPLOAD COMPONENT
 * 
 * Allows users to upload images and videos to events
 * Features:
 * - Drag & drop support
 * - File preview
 * - Multiple file upload
 * - Error handling
 * - File validation
 */
const EventMediaUpload = ({ eventId, eventTitle, onMediaUpdated }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:5000';

  const getMediaUrl = (mediaPath) =>
    mediaPath?.startsWith('http') ? mediaPath : `${mediaBaseUrl}${mediaPath}`;
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [existingMedia, setExistingMedia] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(false);

  // Fetch existing media when component mounts
  useEffect(() => {
    fetchEventMedia();
  }, [eventId]);

  /**
   * Fetch all media associated with the event
   */
  const fetchEventMedia = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}/media`);
      setExistingMedia({
        images: response.data.images || [],
        videos: response.data.videos || [],
      });
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle file selection from input
   */
  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'images') {
      setSelectedImages([...selectedImages, ...files]);
    } else {
      setSelectedVideos([...selectedVideos, ...files]);
    }
    setUploadError('');
  };

  /**
   * Handle drag and drop
   */
  const handleDragDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (type === 'images') {
      setSelectedImages([...selectedImages, ...files]);
    } else {
      setSelectedVideos([...selectedVideos, ...files]);
    }
  };

  /**
   * Remove selected file before upload
   */
  const removeFileFromSelection = (index, type) => {
    if (type === 'images') {
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
    } else {
      setSelectedVideos(selectedVideos.filter((_, i) => i !== index));
    }
  };

  /**
   * Upload selected files to the event
   */
  const handleUpload = async () => {
    if (selectedImages.length === 0 && selectedVideos.length === 0) {
      setUploadError('Please select at least one image or video');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();

      // Add selected images
      selectedImages.forEach((file) => {
        formData.append('images', file);
      });

      // Add selected videos
      selectedVideos.forEach((file) => {
        formData.append('videos', file);
      });

      // Upload to server
      const response = await api.post(`/events/${eventId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(`Successfully uploaded ${selectedImages.length} image(s) and ${selectedVideos.length} video(s)!`);
      setSelectedImages([]);
      setSelectedVideos([]);

      // Reset file inputs
      document.getElementById('imageInput').value = '';
      document.getElementById('videoInput').value = '';

      // Refresh media list
      await fetchEventMedia();

      // Notify parent component
      if (onMediaUpdated) {
        onMediaUpdated(response.data.event);
      }
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
        'Error uploading files. Please check file format and size.'
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Delete media from event
   */
  const deleteMedia = async (mediaType, index) => {
    try {
      await api.delete(`/events/${eventId}/media/${mediaType}/${index}`);
      setUploadSuccess(`${mediaType === 'images' ? 'Image' : 'Video'} deleted successfully`);
      await fetchEventMedia();
      if (onMediaUpdated) {
        onMediaUpdated();
      }
    } catch (error) {
      setUploadError('Error deleting media');
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">{eventTitle}</h2>
      <p className="text-gray-400 mb-8">Upload images and videos for this event</p>

      {/* Error Alert */}
      {uploadError && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Success Alert */}
      {uploadSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-lg mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {uploadSuccess}
        </div>
      )}

      {/* Upload Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Images Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            Images
          </h3>

          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDragDrop(e, 'images')}
            className="border-2 border-dashed border-blue-500/50 bg-blue-500/10 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
          >
            <input
              id="imageInput"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'images')}
              className="hidden"
            />
            <label htmlFor="imageInput" className="cursor-pointer">
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Drag images here or click to select</p>
              <p className="text-gray-400 text-sm mb-4">Supported: all image formats (Max 10MB)</p>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
              >
                Select images from device
              </button>
            </label>
          </div>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-300 text-sm font-semibold">{selectedImages.length} image(s) selected:</p>
              {selectedImages.map((file, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-gray-200 text-sm truncate">{file.name}</span>
                  <button
                    onClick={() => removeFileFromSelection(index, 'images')}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Existing Images */}
          {existingMedia.images.length > 0 && (
            <div className="mt-6">
              <p className="text-gray-300 text-sm font-semibold mb-2">Existing Images:</p>
              <div className="grid grid-cols-2 gap-2">
                {existingMedia.images.map((imagePath, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getMediaUrl(imagePath)}
                      alt="Event"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => deleteMedia('images', index)}
                      className="absolute top-1 right-1 bg-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Videos Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            Videos
          </h3>

          {/* Upload Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDragDrop(e, 'videos')}
            className="border-2 border-dashed border-purple-500/50 bg-purple-500/10 rounded-lg p-6 text-center hover:border-purple-500 transition-colors"
          >
            <input
              id="videoInput"
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileSelect(e, 'videos')}
              className="hidden"
            />
            <label htmlFor="videoInput" className="cursor-pointer">
              <Play className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Drag videos here or click to select</p>
              <p className="text-gray-400 text-sm mb-4">Supported: MP4, MKV, WebM (Max 50MB)</p>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all"
              >
                Select videos from device
              </button>
            </label>
          </div>

          {/* Selected Videos Preview */}
          {selectedVideos.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-300 text-sm font-semibold">{selectedVideos.length} video(s) selected:</p>
              {selectedVideos.map((file, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-gray-200 text-sm truncate">{file.name}</span>
                  <button
                    onClick={() => removeFileFromSelection(index, 'videos')}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Existing Videos */}
          {existingMedia.videos.length > 0 && (
            <div className="mt-6">
              <p className="text-gray-300 text-sm font-semibold mb-2">Existing Videos:</p>
              <div className="space-y-2">
                {existingMedia.videos.map((videoPath, index) => (
                  <div key={index} className="relative group bg-gray-700 p-2 rounded-lg flex items-center justify-between">
                    <a
                      href={getMediaUrl(videoPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm truncate flex-1"
                    >
                      {videoPath.split('/').pop()}
                    </a>
                    <button
                      onClick={() => deleteMedia('videos', index)}
                      className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || (selectedImages.length === 0 && selectedVideos.length === 0)}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
      >
        {uploading ? 'Uploading...' : 'Upload Media'}
      </button>

      {/* File Count Summary */}
      {(selectedImages.length > 0 || selectedVideos.length > 0) && (
        <p className="text-gray-400 text-sm mt-4 text-center">
          Ready to upload: {selectedImages.length} image(s) + {selectedVideos.length} video(s)
        </p>
      )}
    </div>
  );
};

export default EventMediaUpload;
