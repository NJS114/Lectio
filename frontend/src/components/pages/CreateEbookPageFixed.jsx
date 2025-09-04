import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEbooks } from '../../hooks/useEbooks';
import { useAuth } from '../../hooks/useAuth';
import {
  Upload, FileText, Image, DollarSign, Tag, Globe,
  Save, Eye, ArrowLeft, Plus, X, AlertCircle, Check
} from 'lucide-react';

const CreateEbookPageFixed = () => {
  const navigate = useNavigate();
  const { createEbook, isLoading } = useEbooks();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    format: 'PDF',
    pages: '',
    language: 'Français',
    tags: [],
    cover: null,
    preview: null,
    files: [],
    tableOfContents: [''],
    author_info: {
      name: user?.name || '',
      bio: '',
      social: {
        linkedin: '',
        twitter: '',
        website: ''
      }
    },
    affiliate_links: []
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Business', 'Informatique', 'Marketing', 'Design', 'Développement Personnel',
    'Fiction', 'Non-Fiction', 'Éducation', 'Santé', 'Cuisine', 'Voyage', 'Art'
  ];

  const formats = ['PDF', 'EPUB', 'MOBI', 'PDF + EPUB', 'Tous formats'];
  const languages = ['Français', 'Anglais', 'Espagnol', 'Italien', 'Allemand'];

  const steps = [
    { id: 1, title: 'Informations de base', icon: FileText },
    { id: 2, title: 'Contenu et fichiers', icon: Upload },
    { id: 3, title: 'Prix et distribution', icon: DollarSign },
    { id: 4, title: 'Aperçu et publication', icon: Eye }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleFileUpload = (type, files) => {
    if (type === 'cover' || type === 'preview') {
      setFormData(prev => ({
        ...prev,
        [type]: files[0]
      }));
    } else if (type === 'files') {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(files)]
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
        if (!formData.author.trim()) newErrors.author = 'L\'auteur est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.category) newErrors.category = 'La catégorie est requise';
        break;
      case 2:
        if (!formData.cover) newErrors.cover = 'Une couverture est requise';
        if (formData.files.length === 0) newErrors.files = 'Au moins un fichier est requis';
        break;
      case 3:
        if (!formData.price || formData.price <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    try {
      const ebookData = {
        ...formData,
        cover: formData.cover ? URL.createObjectURL(formData.cover) : '/api/placeholder/300/400',
        preview: formData.preview ? URL.createObjectURL(formData.preview) : '/api/placeholder/600/800',
        fileSize: formData.files.reduce((total, file) => total + file.size, 0),
        isbn: `978-2-${Math.random().toString().substr(2, 9)}`,
        tableOfContents: formData.tableOfContents.filter(item => item.trim())
      };

      await createEbook(ebookData);
      navigate('/dashboard?tab=ebooks');
    } catch (error) {
      console.error('Erreur lors de la création de l\'ebook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-ebook-page">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            Retour
          </button>
          <h1>Créer un ebook</h1>
          <p>Partagez vos connaissances et générez des revenus</p>
        </div>

        {/* Progress Steps */}
        <div className="steps-progress">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            >
              <div className="step-icon">
                <step.icon size={20} />
              </div>
              <span>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>📝 Informations de base</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Titre de l'ebook *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Guide complet du Marketing Digital"
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Auteur *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Votre nom ou nom de plume"
                  className={errors.author ? 'error' : ''}
                />
                {errors.author && <span className="error-message">{errors.author}</span>}
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre ebook, son contenu, à qui il s'adresse..."
                  rows={4}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label>Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                >
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Tags</label>
                <div className="tags-input">
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="add-tag">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter un tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button type="button" onClick={addTag}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content and Files */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>📁 Contenu et fichiers</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Couverture *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('cover', e.target.files)}
                    id="cover-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="cover-upload" className="upload-area">
                    {formData.cover ? (
                      <div className="file-preview">
                        <img src={URL.createObjectURL(formData.cover)} alt="Couverture" />
                        <span>{formData.cover.name}</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Image size={48} />
                        <span>Cliquez pour ajouter une couverture</span>
                        <small>JPG, PNG - Max 5MB</small>
                      </div>
                    )}
                  </label>
                </div>
                {errors.cover && <span className="error-message">{errors.cover}</span>}
              </div>

              <div className="form-group">
                <label>Aperçu (optionnel)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('preview', e.target.files)}
                    id="preview-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="preview-upload" className="upload-area">
                    {formData.preview ? (
                      <div className="file-preview">
                        <img src={URL.createObjectURL(formData.preview)} alt="Aperçu" />
                        <span>{formData.preview.name}</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Eye size={48} />
                        <span>Aperçu du contenu</span>
                        <small>Image d'une page exemple</small>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Fichiers de l'ebook *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.epub,.mobi"
                    onChange={(e) => handleFileUpload('files', e.target.files)}
                    id="files-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="files-upload" className="upload-area">
                    <div className="upload-placeholder">
                      <Upload size={48} />
                      <span>Cliquez pour ajouter vos fichiers</span>
                      <small>PDF, EPUB, MOBI - Max 50MB par fichier</small>
                    </div>
                  </label>
                </div>
                
                {formData.files.length > 0 && (
                  <div className="files-list">
                    <h4>📚 Fichiers ajoutés :</h4>
                    {formData.files.map((file, index) => (
                      <div key={index} className="file-item">
                        <FileText size={20} />
                        <span>{file.name}</span>
                        <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>
                )}
                {errors.files && <span className="error-message">{errors.files}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Price */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>💰 Prix et distribution</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Prix de vente *</label>
                <div className="price-input">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="19.99"
                    min="0"
                    step="0.01"
                    className={errors.price ? 'error' : ''}
                  />
                  <span className="currency">€</span>
                </div>
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label>Prix original (optionnel)</label>
                <div className="price-input">
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    placeholder="29.99"
                    min="0"
                    step="0.01"
                  />
                  <span className="currency">€</span>
                </div>
                <small>Pour afficher une réduction</small>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2>👁️ Aperçu et publication</h2>
            
            <div className="ebook-preview">
              <div className="preview-card">
                <div className="preview-cover">
                  {formData.cover ? (
                    <img src={URL.createObjectURL(formData.cover)} alt="Couverture" />
                  ) : (
                    <div className="placeholder-cover">
                      <Image size={48} />
                    </div>
                  )}
                </div>
                
                <div className="preview-info">
                  <h3>{formData.title || 'Titre de l\'ebook'}</h3>
                  <p className="author">Par {formData.author || 'Auteur'}</p>
                  <p className="category">{formData.category}</p>
                  
                  <div className="price-display">
                    {formData.originalPrice && formData.originalPrice > formData.price && (
                      <span className="original-price">{formData.originalPrice}€</span>
                    )}
                    <span className="current-price">{formData.price || '0'}€</span>
                  </div>

                  <div className="preview-details">
                    <span>{formData.format}</span>
                    <span>{formData.language}</span>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="preview-tags">
                      {formData.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="step-navigation">
          {currentStep > 1 && (
            <button onClick={prevStep} className="btn-secondary">
              <ArrowLeft size={16} />
              Précédent
            </button>
          )}
          
          {currentStep < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Suivant
              <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Publication...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Publier l'ebook
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .create-ebook-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e1e5e9;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .steps-progress {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step.current .step-icon {
          background: #8b5cf6;
          color: white;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #8b5cf6;
          background: #f9fafb;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
        }

        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .file-preview img {
          max-width: 150px;
          max-height: 200px;
          border-radius: 8px;
        }

        .files-list {
          margin-top: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .file-item:last-child {
          border-bottom: none;
        }

        .file-size {
          margin-left: auto;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .tags-input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.5rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .tag {
          background: #8b5cf6;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .tag button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .add-tag {
          display: flex;
          gap: 0.5rem;
        }

        .add-tag input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.25rem;
        }

        .add-tag button {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
        }

        .price-input {
          position: relative;
        }

        .currency {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 600;
        }

        .ebook-preview {
          display: flex;
          justify-content: center;
        }

        .preview-card {
          display: flex;
          gap: 1.5rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          max-width: 500px;
        }

        .preview-cover {
          flex-shrink: 0;
        }

        .preview-cover img {
          width: 120px;
          height: 160px;
          object-fit: cover;
          border-radius: 8px;
        }

        .placeholder-cover {
          width: 120px;
          height: 160px;
          background: #f3f4f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .preview-info h3 {
          margin: 0 0 0.5rem 0;
          color: #111827;
        }

        .author {
          color: #6b7280;
          margin: 0 0 0.5rem 0;
        }

        .category {
          color: #8b5cf6;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        .price-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #059669;
        }

        .original-price {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .preview-details {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .step-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-secondary,
        .btn-primary,
        .btn-success {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-primary {
          background: #8b5cf6;
          color: white;
          border: none;
        }

        .btn-success {
          background: #10b981;
          color: white;
          border: none;
        }

        .btn-primary:hover {
          background: #7c3aed;
        }

        .btn-success:hover {
          background: #059669;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .preview-card {
            flex-direction: column;
            text-align: center;
          }
          
          .steps-progress {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateEbookPageFixed;

