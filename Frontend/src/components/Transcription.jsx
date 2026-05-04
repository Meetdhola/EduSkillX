import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Transcription.css';

const Transcription = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTranscription, setSelectedTranscription] = useState(null);

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const fetchTranscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transcriptions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTranscriptions(response.data.data);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      toast.error('Failed to fetch transcriptions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/transcriptions`,
        { youtubeUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Transcription process started');
      setYoutubeUrl('');
      fetchTranscriptions();
    } catch (error) {
      console.error('Error creating transcription:', error);
      toast.error(error.response?.data?.message || 'Failed to create transcription');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/transcriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Transcription deleted successfully');
      fetchTranscriptions();
    } catch (error) {
      console.error('Error deleting transcription:', error);
      toast.error('Failed to delete transcription');
    }
  };

  const handleViewTranscription = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transcriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedTranscription(response.data.data);
    } catch (error) {
      console.error('Error fetching transcription:', error);
      toast.error('Failed to fetch transcription details');
    }
  };

  const handleDownloadPDF = (pdfPath) => {
    window.open(`${process.env.REACT_APP_API_URL}/${pdfPath}`, '_blank');
  };

  return (
    <div className="transcription-container">
      <h1>YouTube Video Transcription</h1>
      
      <form onSubmit={handleSubmit} className="transcription-form">
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          required
          className="url-input"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Processing...' : 'Transcribe Video'}
        </button>
      </form>

      <div className="transcriptions-list">
        <h2>Your Transcriptions</h2>
        {transcriptions.length === 0 ? (
          <p>No transcriptions found</p>
        ) : (
          <div className="transcription-cards">
            {transcriptions.map((transcription) => (
              <div key={transcription._id} className="transcription-card">
                <h3>{transcription.videoTitle}</h3>
                <p>Created: {new Date(transcription.createdAt).toLocaleDateString()}</p>
                <div className="card-actions">
                  <button
                    onClick={() => handleViewTranscription(transcription._id)}
                    className="view-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(transcription.pdfPath)}
                    className="download-button"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDelete(transcription._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTranscription && (
        <div className="transcription-modal">
          <div className="modal-content">
            <h2>{selectedTranscription.videoTitle}</h2>
            <div className="modal-section">
              <h3>Summary</h3>
              <p>{selectedTranscription.summary}</p>
            </div>
            <div className="modal-section">
              <h3>Full Transcription</h3>
              <p>{selectedTranscription.transcription}</p>
            </div>
            <button
              onClick={() => setSelectedTranscription(null)}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transcription; 