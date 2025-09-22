
import React from 'react';
import styles from './DarklightSelector.module.css';

interface CollapsibleProps {
	contentLight: React.JSX.Element;
	contentDark: React.JSX.Element;
}

export const DarklightSelector: React.FC<CollapsibleProps> = ({ contentLight, contentDark }) => {
	return (
		<React.Fragment>
			<div className={styles['darklight-selector-container-light']}>
				{contentLight}
			</div>
			<div className={styles['darklight-selector-container-dark']}>
				{contentDark}
			</div>
		</React.Fragment>
	);
};
