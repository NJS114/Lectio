import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEbooks } from '../../hooks/useEbooks';
import { useAuth } from '../../hooks/useAuth';
import {
  Upload, FileText, Image, DollarSign, Tag, Globe,
  Save, Eye, ArrowLeft, Plus, X, AlertCircle, Check
} from 'lucide-react';

const CreateEbookPage = () => {
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
    
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSocialInputChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      author_info: {
        ...prev.author_info,
        social: {
          ...prev.author_info.social,
          [platform]: value
        }
      }
    }));
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

  const addTableOfContentsItem = () => {
    setFormData(prev => ({
      ...prev,
      tableOfContents: [...prev.tableOfContents, '']
    }));
  };

  const updateTableOfContentsItem = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tableOfContents: prev.tableOfContents.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const removeTableOfContentsItem = (index) => {
    setFormData(prev => ({
      ...prev,
      tableOfContents: prev.tableOfContents.filter((_, i) => i !== index)
    }));
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Informations de base</h2>
            
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
                <label>Langue</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nombre de pages</label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  placeholder="Ex: 250"
                  min="1"
                />
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
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Contenu et fichiers</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Couverture *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('cover', e.target.files)}
                    id="cover-upload"
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

              <div className="form-group full-width">
                <label>Table des matières</label>
                <div className="table-of-contents">
                  {formData.tableOfContents.map((item, index) => (
                    <div key={index} className="toc-item">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateTableOfContentsItem(index, e.target.value)}
                        placeholder={`Chapitre ${index + 1}`}
                      />
                      {formData.tableOfContents.length > 1 && (
                        <button type="button" onClick={() => removeTableOfContentsItem(index)}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addTableOfContentsItem} className="add-toc-item">
                    <Plus size={16} />
                    Ajouter un chapitre
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Prix et distribution</h2>
            
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

              <div className="form-group full-width">
                <label>Informations sur l'auteur</label>
                <div className="author-info">
                  <div className="form-group">
                    <label>Nom d'affichage</label>
                    <input
                      type="text"
                      value={formData.author_info.name}
                      onChange={(e) => handleNestedInputChange('author_info', 'name', e.target.value)}
                      placeholder="Votre nom public"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Biographie</label>
                    <textarea
                      value={formData.author_info.bio}
                      onChange={(e) => handleNestedInputChange('author_info', 'bio', e.target.value)}
                      placeholder="Présentez-vous en quelques lignes..."
                      rows={3}
                    />
                  </div>

                  <div className="social-links">
                    <h4>Réseaux sociaux (optionnel)</h4>
                    <div className="form-group">
                      <label>LinkedIn</label>
                      <input
                        type="url"
                        value={formData.author_info.social.linkedin}
                        onChange={(e) => handleSocialInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/votre-profil"
                      />
                    </div>
                    <div className="form-group">
                      <label>Twitter</label>
                      <input
                        type="url"
                        value={formData.author_info.social.twitter}
                        onChange={(e) => handleSocialInputChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/votre-compte"
                      />
                    </div>
                    <div className="form-group">
                      <label>Site web</label>
                      <input
                        type="url"
                        value={formData.author_info.social.website}
                        onChange={(e) => handleSocialInputChange('website', e.target.value)}
                        placeholder="https://votre-site.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Aperçu et publication</h2>
            
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
                    {formData.originalPrice && formData.originalPrice > formData.price && (
                      <span className="discount">
                        -{Math.round((1 - formData.price / formData.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="preview-details">
                    <span>{formData.format}</span>
                    {formData.pages && <span>{formData.pages} pages</span>}
                    <span>{formData.language}</span>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="preview-tags">
                      {formData.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                      {formData.tags.length > 3 && <span className="tag">+{formData.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="preview-description">
                <h4>Description</h4>
                <p>{formData.description || 'Aucune description fournie.'}</p>
              </div>

              {formData.tableOfContents.filter(item => item.trim()).length > 0 && (
                <div className="preview-toc">
                  <h4>Table des matières</h4>
                  <ul>
                    {formData.tableOfContents.filter(item => item.trim()).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="create-ebook-page">
        <div className="container">
          <div className="login-required">
            <AlertCircle size={48} />
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour créer un ebook.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-ebook-page">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <ArrowLeft size={20} />
            Retour au dashboard
          </button>
          <h1>Créer un nouvel ebook</h1>
        </div>

        <div className="creation-wizard">
          <div className="steps-indicator">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
                >
                  <div className="step-icon">
                    <Icon size={20} />
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              );
            })}
          </div>

          <div className="wizard-content">
            {renderStepContent()}
          </div>

          <div className="wizard-actions">
            {currentStep > 1 && (
              <button onClick={prevStep} className="btn btn-secondary">
                Précédent
              </button>
            )}
            
            <div className="actions-right">
              {currentStep < 4 ? (
                <button onClick={nextStep} className="btn btn-primary">
                  Suivant
                </button>
              ) : (
                <button 
                  onClick={handleSubmit} 
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Publication...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Publier l'ebook
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-ebook-page {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem 0;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .creation-wizard {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .steps-indicator {
          display: flex;
          background: var(--color-background);
          padding: 2rem;
          gap: 2rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          position: relative;
        }

        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 2rem;
          height: 2px;
          background: var(--color-border);
        }

        .step.active:not(:last-child)::after {
          background: var(--color-primary);
        }

        .step-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: all 0.3s ease;
        }

        .step.active .step-icon {
          background: var(--color-primary);
          color: white;
        }

        .step.current .step-icon {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 0 0 4px var(--color-primary-light);
        }

        .step-title {
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: color 0.3s ease;
        }

        .step.active .step-title {
          color: var(--color-text);
        }

        .wizard-content {
          padding: 2rem;
        }

        .step-content h2 {
          margin: 0 0 2rem 0;
          color: var(--color-text);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: var(--color-text);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.9rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: var(--color-error);
        }

        .error-message {
          color: var(--color-error);
          font-size: 0.8rem;
        }

        .price-input {
          position: relative;
        }

        .price-input .currency {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .tags-input {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 0.5rem;
          min-height: 3rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--color-primary-light);
          color: var(--color-primary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .tag button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
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
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .file-upload {
          position: relative;
        }

        .file-upload input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .upload-area {
          display: block;
          border: 2px dashed var(--color-border);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
        }

        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .file-preview img {
          max-width: 100px;
          max-height: 120px;
          object-fit: cover;
          border-radius: 4px;
        }

        .files-list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--color-background);
          border-radius: 4px;
        }

        .file-size {
          margin-left: auto;
          color: var(--color-text-secondary);
          font-size: 0.8rem;
        }

        .table-of-contents {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .toc-item {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .toc-item input {
          flex: 1;
        }

        .toc-item button {
          background: var(--color-error);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .add-toc-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border: none;
          border-radius: 4px;
          padding: 0.5rem;
          cursor: pointer;
          align-self: flex-start;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .social-links h4 {
          margin: 0;
          color: var(--color-text);
        }

        .ebook-preview {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .preview-card {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .preview-cover {
          flex-shrink: 0;
          width: 150px;
          height: 200px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--color-border);
        }

        .preview-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-cover {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .preview-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .preview-info h3 {
          margin: 0;
          color: var(--color-text);
        }

        .preview-info .author {
          color: var(--color-text-secondary);
          margin: 0;
        }

        .preview-info .category {
          color: var(--color-primary);
          font-weight: 500;
          margin: 0;
        }

        .price-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .original-price {
          text-decoration: line-through;
          color: var(--color-text-secondary);
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .discount {
          background: var(--color-success);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .preview-details {
          display: flex;
          gap: 1rem;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .preview-description,
        .preview-toc {
          padding: 1.5rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .preview-description h4,
        .preview-toc h4 {
          margin: 0 0 1rem 0;
          color: var(--color-text);
        }

        .preview-description p {
          margin: 0;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .preview-toc ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .preview-toc li {
          margin-bottom: 0.5rem;
          color: var(--color-text-secondary);
        }

        .wizard-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-top: 1px solid var(--color-border);
          background: var(--color-background);
        }

        .actions-right {
          display: flex;
          gap: 1rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
        }

        .btn-secondary {
          background: var(--color-border);
          color: var(--color-text);
        }

        .btn-secondary:hover {
          background: var(--color-text-secondary);
          color: white;
        }

        .btn-success {
          background: var(--color-success);
          color: white;
        }

        .btn-success:hover {
          background: var(--color-success-dark);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-required {
          text-align: center;
          padding: 4rem 0;
          color: var(--color-text-secondary);
        }

        .login-required h2 {
          margin: 1rem 0;
          color: var(--color-text);
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .steps-indicator {
            flex-direction: column;
            gap: 1rem;
          }
          
          .step:not(:last-child)::after {
            display: none;
          }
          
          .preview-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .wizard-actions {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateEbookPage;

