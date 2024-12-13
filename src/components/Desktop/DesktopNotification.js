import React from 'react';
import styles from './DesktopNotification.module.css';

const DesktopNotification = () => {
  return (
    <div className={styles.notification}>
      
      <div className={styles.gridContainer}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <h1>Wrong Place, <br></br>Right Idea.</h1>
          <p>We love your enthusiasm, but this app works only on mobile. Pop over there, and we’ll blow you away.</p>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <span>Aspect</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopNotification;