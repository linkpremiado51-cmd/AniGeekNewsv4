/* scripts/acesso.js */

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Usa o app já inicializado em config-firebase.js
 */
const auth = getAuth();

/**
 * Elementos
 */
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const mensagem = document.getElementById('mensagem');

/**
 * LOGIN
 */
loginBtn?.addEventListener('click', async () => {
    const email = document.getElementById('login-email')?.value.trim();
    const senha = document.getElementById('login-senha')?.value;

    if (!email || !senha) {
        mensagem.textContent = 'Preencha e-mail e senha.';
        mensagem.style.color = 'red';
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, senha);

        mensagem.textContent = 'Login realizado com sucesso!';
        mensagem.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);

    } catch (error) {
        mensagem.textContent = 'E-mail ou senha inválidos.';
        mensagem.style.color = 'red';
        console.error(error);
    }
});

/**
 * CADASTRO
 */
signupBtn?.addEventListener('click', async () => {
    const nome = document.getElementById('signup-nome')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const senha = document.getElementById('signup-senha')?.value;

    if (!nome || !email || !senha) {
        mensagem.textContent = 'Preencha todos os campos.';
        mensagem.style.color = 'red';
        return;
    }

    if (senha.length < 6) {
        mensagem.textContent = 'A senha precisa ter no mínimo 6 caracteres.';
        mensagem.style.color = 'red';
        return;
    }

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);

        await updateProfile(cred.user, {
            displayName: nome
        });

        mensagem.textContent = 'Conta criada com sucesso!';
        mensagem.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);

    } catch (error) {
        mensagem.textContent = 'Erro ao criar conta.';
        mensagem.style.color = 'red';
        console.error(error);
    }
});
