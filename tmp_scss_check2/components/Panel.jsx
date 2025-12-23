import React from 'react';
import styles from './Panel.module.scss';
import clsx from 'clsx';

const Panel = ({ children, className = "" }) => {
    return (
        <div className={clsx(styles.panel, className)}>
            {children}
        </div>
    );
};

export default Panel;
