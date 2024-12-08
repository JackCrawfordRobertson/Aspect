import React, { useState } from 'react';
import { auth, db } from '../../../../Firebase/firebaseConfig'; // Firebase setup
import { doc, setDoc } from 'firebase/firestore';
import styles from './GenreSelector.module.css'; // CSS Module

const GenreSelector = ({ onGenresSelected }) => {
  const [selectedGenres, setSelectedGenres] = useState([]); // Track selected genres
  const genres = ['Action', 'Romance', 'Comedy', 'Thriller', 'Drama', 'Horror', 'Sci-Fi', 'Fantasy']; // Movie genres

  // Handle selecting/deselecting a genre
  const handleBubbleClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre)); // Deselect
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]); // Select
    }
  };

  // Submit selected genres to Firestore
  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser?.uid; // Ensure UID is available
      if (!userId) throw new Error("No user is logged in.");
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { selectedGenres }, { merge: true }); // Save genres in Firestore
      console.log('Genres saved successfully!');
      if (onGenresSelected) onGenresSelected(); // Trigger parent callback
    } catch (error) {
      console.error('Error saving genres:', error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Pick Your Movie Vibes.</h1>
      <p>Click on the genres that match your mood. Love a romcom? Crave a thriller? Let’s set the tone for your perfect movie night.</p>
      <p>
        <span style={{ color: selectedGenres.length === 3 ? 'red' : 'inherit' }}>
          {selectedGenres.length} Picked of 3
        </span>
      </p>
      <div className={styles.bubbleContainer}>
        {genres.map((genre) => (
          <div
            key={genre}
            className={`${styles.bubble} ${
              selectedGenres.includes(genre) ? styles.selected : ''
            }`}
            onClick={() => handleBubbleClick(genre)}
          >
            {genre}
          </div>
        ))}
      </div>
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={selectedGenres.length !== 3}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default GenreSelector;