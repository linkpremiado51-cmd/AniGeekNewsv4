/* scripts/acesso.js */

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const mensagem = document.getElementById('mensagem');

/* LOGIN */
loginBtn?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        mensagem.style.color = 'green';
        mensagem.textContent = 'Login realizado com sucesso!';
        setTimeout(() => window.location.href = 'index.html', 800);
    } catch (err) {
        mensagem.style.color = 'red';
        mensagem.textContent = 'Erro ao entrar: ' + err.message;
    }
});

/* CADASTRO */
signupBtn?.addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);

        await updateProfile(cred.user, {
            displayName: nome
        });

        mensagem.style.color = 'green';
        mensagem.textContent = 'Conta criada com sucesso!';
        setTimeout(() => window.location.href = 'index.html', 800);
    } catch (err) {
        mensagem.style.color = 'red';
        mensagem.textContent = 'Erro no cadastro: ' + err.message;
    }
});
