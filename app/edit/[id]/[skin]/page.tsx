import React, { useState, useEffect } from 'react';

// Interface pour les données du skin
interface SkinData {
  name: string;
  description: string;
  url: string;
  color: string;
  style: string;
  bold: boolean;
}

// Données de test
const testSkinData: SkinData = {
  name: "Skin Futuriste",
  description: "Un skin moderne avec des effets lumineux et une interface épurée, parfait pour une expérience gaming immersive.",
  url: "https://example.com/skins/futuristic-skin",
  color: "#00FF88",
  style: "futuristic",
  bold: true
};

const SkinEditor: React.FC = () => {
  // États pour le formulaire
  const [skinData, setSkinData] = useState<SkinData>({
    name: '',
    description: '',
    url: '',
    color: '#FFFFFF',
    style: '',
    bold: false
  });

  // Met à jour un champ spécifique
  const updateField = (field: keyof SkinData, value: string | boolean) => {
    setSkinData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Charge les données de test
  const loadTestData = () => {
    setSkinData(testSkinData);
  };

  // Réinitialise le formulaire
  const resetForm = () => {
    setSkinData({
      name: '',
      description: '',
      url: '',
      color: '#FFFFFF',
      style: '',
      bold: false
    });
  };

  // Exporte les données
  const exportData = () => {
    const jsonString = JSON.stringify(skinData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skin-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Données exportées avec succès !');
  };

  // Auto-chargement des données de test après le montage
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTestData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Log des données à chaque changement
  useEffect(() => {
    console.log('Données du skin:', skinData);
  }, [skinData]);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerH1}>🎨 Éditeur de Skin</h1>
          <p>Personnalisez l'apparence et les propriétés de votre skin</p>
        </div>

        <div style={styles.mainContent}>
          {/* Section 1: Informations de base */}
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>Informations de base</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nom du Skin</label>
              <input
                type="text"
                value={skinData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Entrez le nom du skin"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={skinData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Décrivez votre skin..."
                style={{...styles.input, ...styles.textarea}}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>URL</label>
              <input
                type="url"
                value={skinData.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://example.com/skin"
                style={styles.input}
              />
            </div>
          </div>

          {/* Section 2: Métadonnées */}
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>Métadonnées</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Couleur</label>
              <div style={styles.colorInputGroup}>
                <input
                  type="color"
                  value={skinData.color}
                  onChange={(e) => updateField('color', e.target.value.toUpperCase())}
                  style={styles.colorInput}
                />
                <input
                  type="text"
                  value={skinData.color}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                      updateField('color', value.toUpperCase());
                    }
                  }}
                  placeholder="#FFFFFF"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Style</label>
              <input
                type="text"
                value={skinData.style}
                onChange={(e) => updateField('style', e.target.value)}
                placeholder="modern, classic, futuristic..."
                style={styles.input}
              />
            </div>
          </div>

          {/* Section 3: Options */}
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>Options</h2>

            <div style={styles.formGroup}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={skinData.bold}
                  onChange={(e) => updateField('bold', e.target.checked)}
                  style={styles.checkbox}
                />
                <label style={styles.label}>Texte en gras</label>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={loadTestData} style={{...styles.button, ...styles.btnPrimary}}>
                Charger Test
              </button>
              <button onClick={resetForm} style={{...styles.button, ...styles.btnSecondary}}>
                Réinitialiser
              </button>
              <button onClick={exportData} style={{...styles.button, ...styles.btnPrimary}}>
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles convertis en objets JavaScript
const styles = {
  body: {
    margin: 0,
    boxSizing: 'border-box' as const,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden' as const,
  },
  header: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    padding: '30px',
    textAlign: 'center' as const,
    color: 'white',
  },
  headerH1: {
    fontSize: '2.5em',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  mainContent: {
    padding: '30px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    marginBottom: '25px',
  },
  sectionH2: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.5em',
    borderBottom: '3px solid #4facfe',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600' as const,
    color: '#555',
    fontSize: '0.9em',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: '#fafbfc',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    resize: 'vertical' as const,
    minHeight: '80px',
  },
  colorInputGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  colorInput: {
    width: '50px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    accentColor: '#4facfe',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap' as const,
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: '1',
    minWidth: '120px',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
  },
  btnSecondary: {
    background: '#6c757d',
    color: 'white',
  },
};

export default SkinEditor;
//test