import React, { useState } from 'react';
import styles from './CollapsibleCode.module.css';
import { CollapsibleCodeProps } from './types';

export const CollapsibleCode: React.FC<CollapsibleCodeProps> = ({ 
    children, 
    maxLines = 5,
    buttonShowMoreText = 'Show More',
    buttonShowLessText = 'Show Less',
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div className={styles.codeWrapper}>
            <div 
                className={`${styles.codeBlock} ${!isExpanded ? styles.collapsed : ''}`}
                style={!isExpanded ? { maxHeight: `${maxLines * 24}px` } : undefined}
            >
                {children}
            </div>
            <button 
                className={styles.toggleButton}
                onClick={() => setIsExpanded(prev => !prev)}
                type="button"
            >
                {isExpanded ? buttonShowLessText : buttonShowMoreText}
            </button>
        </div>
    );
};