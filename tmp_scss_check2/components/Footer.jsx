import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.text}>
                    &copy; {new Date().getFullYear()} Smanzy App. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
