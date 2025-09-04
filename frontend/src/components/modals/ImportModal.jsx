import React, { useState } from 'react';
import { X, Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [importType, setImportType] = useState('csv');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    // Simulation du traitement d'import
    setTimeout(() => {
      const mockResults = {
        total: 25,
        imported: 23,
        errors: 2,
        errorDetails: [
          { line: 5, error: "ISBN invalide: 123456" },
          { line: 12, error: "Prix manquant pour 'Le Petit Prince'" }
        ]
      };
      
      setResults(mockResults);
      setIsProcessing(false);
      
      if (onImport) {
        onImport(mockResults);
      }
    }, 2000);
  };

  const downloadTemplate = (type) => {
    const csvTemplate = `titre,auteur,isbn,prix,prix_location,etat,categorie,description,annee_publication,editeur,pages,langue
"L'Étranger","Albert Camus","9782070360024","8.50","0.60","tres_bon","Roman","Roman emblématique de Camus","1942","Gallimard","186","Français"
"Sapiens","Yuval Noah Harari","9782226257017","12.00","0.80","bon","Essai","Une brève histoire de l'humanité","2015","Albin Michel","512","Français"`;

    const jsonTemplate = JSON.stringify([
      {
        "titre": "L'Étranger",
        "auteur": "Albert Camus",
        "isbn": "9782070360024",
        "prix": 8.50,
        "prix_location": 0.60,
        "etat": "tres_bon",
        "categorie": "Roman",
        "description": "Roman emblématique de Camus",
        "annee_publication": 1942,
        "editeur": "Gallimard",
        "pages": 186,
        "langue": "Français"
      },
      {
        "titre": "Sapiens",
        "auteur": "Yuval Noah Harari",
        "isbn": "9782226257017",
        "prix": 12.00,
        "prix_location": 0.80,
        "etat": "bon",
        "categorie": "Essai",
        "description": "Une brève histoire de l'humanité",
        "annee_publication": 2015,
        "editeur": "Albin Michel",
        "pages": 512,
        "langue": "Français"
      }
    ], null, 2);

    const content = type === 'csv' ? csvTemplate : jsonTemplate;
    const filename = `lectio_template.${type}`;
    const mimeType = type === 'csv' ? 'text/csv' : 'application/json';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResults(null);
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Importer des livres</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {!results ? (
            <>
              <div className="import-type-selector">
                <h3>Format de fichier</h3>
                <div className="type-options">
                  <label className={`type-option ${importType === 'csv' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      value="csv"
                      checked={importType === 'csv'}
                      onChange={(e) => setImportType(e.target.value)}
                    />
                    <div className="option-content">
                      <FileText size={24} />
                      <span>CSV</span>
                      <p>Fichier de valeurs séparées par des virgules</p>
                    </div>
                  </label>

                  <label className={`type-option ${importType === 'json' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      value="json"
                      checked={importType === 'json'}
                      onChange={(e) => setImportType(e.target.value)}
                    />
                    <div className="option-content">
                      <FileText size={24} />
                      <span>JSON</span>
                      <p>Fichier de données structurées</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="template-download">
                <h3>Modèle de fichier</h3>
                <p>Téléchargez le modèle pour structurer vos données correctement</p>
                <button 
                  className="btn btn--secondary"
                  onClick={() => downloadTemplate(importType)}
                >
                  <Download size={16} />
                  Télécharger le modèle {importType.toUpperCase()}
                </button>
              </div>

              <div className="file-upload">
                <h3>Sélectionner le fichier</h3>
                <div 
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload size={48} />
                  <h4>Glissez-déposez votre fichier ici</h4>
                  <p>ou cliquez pour parcourir</p>
                  <input
                    type="file"
                    accept={importType === 'csv' ? '.csv' : '.json'}
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <button className="btn btn--secondary">
                    Choisir un fichier
                  </button>
                </div>

                {file && (
                  <div className="selected-file">
                    <FileText size={20} />
                    <span>{file.name}</span>
                    <button onClick={() => setFile(null)}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="import-info">
                <h4>Champs requis :</h4>
                <ul>
                  <li><strong>titre</strong> - Titre du livre</li>
                  <li><strong>auteur</strong> - Nom de l'auteur</li>
                  <li><strong>isbn</strong> - Code ISBN du livre</li>
                  <li><strong>prix</strong> - Prix de vente (optionnel)</li>
                  <li><strong>etat</strong> - État du livre (neuf, tres_bon, bon, correct)</li>
                </ul>
                
                <h4>Champs optionnels :</h4>
                <ul>
                  <li>prix_location, categorie, description, annee_publication, editeur, pages, langue</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="import-results">
              <div className="results-header">
                <CheckCircle size={48} className="success-icon" />
                <h3>Import terminé</h3>
              </div>

              <div className="results-stats">
                <div className="stat">
                  <span className="stat-number">{results.total}</span>
                  <span className="stat-label">Lignes traitées</span>
                </div>
                <div className="stat success">
                  <span className="stat-number">{results.imported}</span>
                  <span className="stat-label">Livres importés</span>
                </div>
                <div className="stat error">
                  <span className="stat-number">{results.errors}</span>
                  <span className="stat-label">Erreurs</span>
                </div>
              </div>

              {results.errors > 0 && (
                <div className="error-details">
                  <h4>Détails des erreurs :</h4>
                  {results.errorDetails.map((error, index) => (
                    <div key={index} className="error-item">
                      <AlertCircle size={16} />
                      <span>Ligne {error.line}: {error.error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!results ? (
            <>
              <button className="btn btn--quiet" onClick={onClose}>
                Annuler
              </button>
              <button 
                className="btn btn--primary"
                onClick={handleImport}
                disabled={!file || isProcessing}
              >
                {isProcessing ? 'Import en cours...' : 'Importer'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn--secondary" onClick={reset}>
                Importer un autre fichier
              </button>
              <button className="btn btn--primary" onClick={onClose}>
                Fermer
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
        }

        .import-modal {
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-gray-medium);
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--color-gray-text);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .modal-body {
          padding: var(--spacing-lg);
        }

        .modal-body > div {
          margin-bottom: var(--spacing-xl);
        }

        .modal-body > div:last-child {
          margin-bottom: 0;
        }

        .modal-body h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-dark);
        }

        .type-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .type-option {
          display: flex;
          cursor: pointer;
          border: 2px solid var(--color-gray-medium);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: all var(--transition-fast);
        }

        .type-option:hover {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .type-option.active {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .type-option input {
          display: none;
        }

        .option-content {
          text-align: center;
          width: 100%;
        }

        .option-content span {
          display: block;
          font-weight: 600;
          margin: var(--spacing-sm) 0;
          color: var(--color-gray-dark);
        }

        .option-content p {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .template-download {
          text-align: center;
          padding: var(--spacing-lg);
          background: var(--color-gray-light);
          border-radius: var(--radius-md);
        }

        .template-download p {
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-text);
        }

        .upload-zone {
          border: 2px dashed var(--color-gray-medium);
          border-radius: var(--radius-md);
          padding: var(--spacing-2xl);
          text-align: center;
          position: relative;
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .upload-zone:hover,
        .upload-zone.drag-active {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .upload-zone h4 {
          margin: var(--spacing-md) 0 var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .upload-zone p {
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-text);
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .selected-file {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--color-green-mint);
          border-radius: var(--radius-sm);
        }

        .selected-file button {
          background: none;
          border: none;
          color: var(--color-gray-text);
          cursor: pointer;
          margin-left: auto;
        }

        .import-info {
          background: var(--color-purple-mint);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
        }

        .import-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .import-info ul {
          margin-bottom: var(--spacing-md);
          padding-left: var(--spacing-lg);
        }

        .import-info li {
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-text);
        }

        .import-results {
          text-align: center;
        }

        .results-header {
          margin-bottom: var(--spacing-xl);
        }

        .success-icon {
          color: var(--color-green-dark);
          margin-bottom: var(--spacing-md);
        }

        .results-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat {
          text-align: center;
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          background: var(--color-gray-light);
        }

        .stat.success {
          background: var(--color-green-mint);
        }

        .stat.error {
          background: rgba(232, 168, 124, 0.1);
        }

        .stat-number {
          display: block;
          font-size: 32px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .stat-label {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .error-details {
          text-align: left;
          background: rgba(232, 168, 124, 0.1);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
        }

        .error-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
          color: var(--color-error);
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          border-top: 1px solid var(--color-gray-medium);
        }

        @media (max-width: 768px) {
          .type-options {
            grid-template-columns: 1fr;
          }

          .results-stats {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ImportModal;

