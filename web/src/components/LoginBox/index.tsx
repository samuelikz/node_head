import styles from './styles.module.scss';
import { VscGithubInverted } from 'react-icons/vsc';

export function LoginBox(){
    const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=7d0be3888e21a779b2ef`
    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem </strong>
            <a href={singInUrl} className={styles.singInWithGithub}>
                <VscGithubInverted size="24"/>
                Entrar com github
            </a>
        </div>
    )
}