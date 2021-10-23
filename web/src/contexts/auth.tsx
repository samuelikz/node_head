import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    singInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user : {
        id :string;
        avatar_url: string;
        login: string;
        name: string;
    }    
}


export function AuthProvider(props: AuthProvider){

    const [user, setUser] = useState<User | null>(null);

    const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=7d0be3888e21a779b2ef`

    async function signIn(githubCode: string){
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const {token, user} = response.data;

        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user);
    }

    function signOut(){
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`
            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }

    },[])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode)

            signIn(githubCode)
        }
    })
    return(
        <AuthContext.Provider value={{ singInUrl, user, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}