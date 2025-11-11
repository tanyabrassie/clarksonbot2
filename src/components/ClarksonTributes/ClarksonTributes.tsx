import { useState, useEffect } from 'react';
import styles from './ClarksonTributes.module.scss';
import type { Tribute } from '../../types/tribute';
import { fetchTributes, addTribute } from '../../services/gistService';
import candleIcon from '../../assets/candle.svg';
import bowIcon from '../../assets/bow.svg';
import moneyIcon from '../../assets/money.svg';

const tributeIcons: Record<Tribute['type'], string> = {
  candle: candleIcon,
  bow: bowIcon,
  money: moneyIcon,
};

const tributeLabels: Record<Tribute['type'], string> = {
  candle: 'Candle',
  bow: 'Bow',
  money: 'Money',
};

export const ClarksonTributes = () => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [selectedType, setSelectedType] = useState<Tribute['type']>('candle');
  const [authorName, setAuthorName] = useState('');

  // Fetch tributes on mount
  useEffect(() => {
    loadTributes();
  }, []);

  const loadTributes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTributes();
      setTributes(data);
    } catch (err) {
      setError('Failed to load tributes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await addTribute(selectedType, authorName.trim());
      
      // Reload tributes to show the new one
      await loadTributes();
      
      // Reset form
      setAuthorName('');
      setSelectedType('candle');
      
      alert('Tribute added successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to add tribute. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.tributesContainer}>
      <h2 className={styles.title}>Clarkson Tributes</h2>
      
      {/* Add Tribute Form */}
      <div className={styles.formSection}>
        <h3 className={styles.formTitle}>Leave a Tribute</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="tribute-type" className={styles.label}>
              Tribute Type:
            </label>
            <div className={styles.typeSelector}>
              {(['candle', 'bow', 'money'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeButton} ${
                    selectedType === type ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedType(type)}
                  disabled={submitting}
                >
                  <img src={tributeIcons[type]} alt={tributeLabels[type]} />
                  <span>{tributeLabels[type]}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="author-name" className={styles.label}>
              Your Name:
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
              disabled={submitting}
              maxLength={50}
            />
          </div>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting || !authorName.trim()}
          >
            {submitting ? 'Adding...' : 'Add Tribute'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* Tributes Display */}
      <div className={styles.tributesSection}>
        <h3 className={styles.sectionTitle}>
          All Tributes ({tributes.length})
        </h3>
        
        {loading ? (
          <div className={styles.loading}>Loading tributes...</div>
        ) : tributes.length === 0 ? (
          <div className={styles.empty}>
            No tributes yet. Be the first to leave one!
          </div>
        ) : (
          <div className={styles.tributesGrid}>
            {tributes.map((tribute, index) => (
              <div key={index} className={styles.tributeCard}>
                <img
                  src={tributeIcons[tribute.type]}
                  alt={tributeLabels[tribute.type]}
                  className={styles.tributeIcon}
                />
                <div className={styles.tributeInfo}>
                  <div className={styles.tributeType}>
                    {tributeLabels[tribute.type]}
                  </div>
                  <div className={styles.tributeAuthor}>
                    from {tribute.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

