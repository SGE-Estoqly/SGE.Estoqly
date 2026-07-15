// URL DA SUA IMPLANTAÇÃO DO GOOGLE APPS SCRIPT (MANTIDA ORIGINAL)
const URL_API_GOOGLE = "https://script.google.com/macros/s/AKfycbxcEIIUrQqWchzAOZe-TjFkjEt62YLNu8bF5mq9V5NvUc2xHPbxFqZkRBnsBI_1SwAa/exec";

const db = {
    call: async (payload) => {
        // Se a ação não for login, precisamos anexar o ID da planilha do usuário logado
        if (payload.action !== "login") {
            const userSpreadsheetId = localStorage.getItem('sge_spreadsheet_id');
            
            if (!userSpreadsheetId) {
                alert("Sessão inválida ou sem banco de dados vinculado. Retornando ao login.");
                window.location.href = 'index.html';
                return null;
            }
            // Injeta o ID dinamicamente no corpo da requisição POST
            payload.spreadsheetId = userSpreadsheetId;
        }

        try {
            const response = await fetch(URL_API_GOOGLE, {
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
            return await response.json();
        } catch (error) {
            console.error("Erro de conexão com o banco de dados:", error);
            return null;
        }
    },
    // Mantido por compatibilidade com escopos locais antigos
    getFornecedores: () => JSON.parse(localStorage.getItem('sge_fornecedores')) || [
        { id: 1, nome: 'Distribuidora Alfa Ltda' },
        { id: 2, nome: 'Importadora Global Tech' }
    ],
    setFornecedores: (data) => localStorage.setItem('sge_fornecedores', JSON.stringify(data))
};

function checkAuth() {
    const user = localStorage.getItem('sge_session');
    const pathname = window.location.pathname;
    
    // Proteção reforçada para evitar redirecionamentos em falso na raiz do site
    if (!user && !pathname.endsWith('index.html') && pathname !== '/' && pathname !== '') {
        window.location.href = 'index.html';
    }
    return user;
}

function handleLogout() {
    localStorage.removeItem('sge_session');
    localStorage.removeItem('sge_perfil');
    localStorage.removeItem('sge_spreadsheet_id');
    window.location.href = 'index.html';
}

// Executa a validação de segurança imediatamente ao mapear o arquivo
if (!window.location.pathname.endsWith('index.html')) {
    checkAuth();
}

// FUNÇÃO AUTOMÁTICA PARA GERENCIAR O MENU ATIVO
function gerenciarMenuAtivo() {
    // 1. Descobre o nome do arquivo HTML atual (ex: "produtos.html")
    let paginaAtual = window.location.pathname.split("/").pop();

    // Ajuste de segurança: Se vier vazio (ex: "http://localhost:5500/"), assume que é o Dashboard
    if (paginaAtual === "" || paginaAtual === "/") {
        paginaAtual = "dashboard.html";
    }

    // 2. Captura todos os itens do menu lateral
    const itensMenu = document.querySelectorAll('.sidebar-menu .sidebar-item');

    itensMenu.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            // Pega o destino do link (ex: "produtos.html")
            const hrefDestino = link.getAttribute('href');

            // Se a página atual for igual ao destino do link, aplica a classe active. Caso contrário, remove.
            if (paginaAtual === hrefDestino) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

// Executa o acendimento do menu assim que o DOM estiver pronto
window.addEventListener('DOMContentLoaded', gerenciarMenuAtivo);