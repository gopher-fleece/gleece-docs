import React, { JSX, useState } from 'react';
import styles from './Collapsible.module.css';

interface CollapsibleProps {
	children: JSX.Element[];
	buttonShowMoreText: string;
	buttonShowLessText: string;
	collapsedMaxHeight?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
	children,
	buttonShowMoreText = 'Show More',
	buttonShowLessText = 'Show Less',
	collapsedMaxHeight = '10em'
}) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	return (
		<div className={styles.codeWrapper}>
			<div
				className={`${styles.codeBlock} ${!isExpanded ? styles.collapsed : ''}`}
				style={!isExpanded ? { maxHeight: collapsedMaxHeight } : undefined}
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