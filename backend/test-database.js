// backend/test-database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Conectar ao banco
const db = new sqlite3.Database(path.join(__dirname, 'doacao.db'));

console.log('=== TESTANDO BANCO DE DADOS ===\n');

// 1. Verificar se as tabelas existem
console.log('1. Verificando tabelas...');
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error('❌ Erro ao listar tabelas:', err);
    } else {
        console.log('✅ Tabelas encontradas:');
        tables.forEach(table => console.log('   -', table.name));
    }
    
    // 2. Verificar estrutura das tabelas
    console.log('\n2. Verificando estrutura das tabelas...');
    
    // Verificar tabela users
    db.all("PRAGMA table_info(users)", (err, columns) => {
        if (err) {
            console.error('❌ Erro ao verificar tabela users:', err);
        } else {
            console.log('✅ Colunas da tabela users:');
            columns.forEach(col => console.log(`   - ${col.name} (${col.type})`));
        }
    });
    
    // 3. Inserir dados de teste
    console.log('\n3. Inserindo dados de teste...');
    testInsertData();
});

async function testInsertData() {
    try {
        // Criar senha hash
        const hashedPassword = await bcrypt.hash('teste123', 10);
        
        // Inserir doador
        db.run(`INSERT INTO users (type, nome, email, password, telefone, cidade, endereco, bairro) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['doador', 'João Silva', 'joao@teste.com', hashedPassword, '11987654321', 'São Paulo', 'Rua A, 123', 'Centro'],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        console.log('⚠️  Usuário doador já existe');
                    } else {
                        console.error('❌ Erro ao inserir doador:', err);
                    }
                } else {
                    console.log('✅ Doador inserido com ID:', this.lastID);
                    
                    // Inserir doação de teste
                    const doadorId = this.lastID;
                    db.run(`INSERT INTO donations (user_id, doou_antes, items, data_entrega, cras, points) 
                            VALUES (?, ?, ?, ?, ?, ?)`,
                        [doadorId, 'não', '["Caderno","Lápis","Borrachas"]', '2024-01-15', 'Porto Alegre', 7],
                        function(err) {
                            if (err) {
                                console.error('❌ Erro ao inserir doação:', err);
                            } else {
                                console.log('✅ Doação inserida com ID:', this.lastID);
                            }
                        }
                    );
                }
            }
        );
        
        // Inserir solicitante
        db.run(`INSERT INTO users (type, nome, email, password, telefone, cidade, endereco, bairro) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['solicitante', 'Maria Santos', 'maria@teste.com', hashedPassword, '11912345678', 'São Paulo', 'Rua B, 456', 'Vila Nova'],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        console.log('⚠️  Usuário solicitante já existe');
                    } else {
                        console.error('❌ Erro ao inserir solicitante:', err);
                    }
                } else {
                    console.log('✅ Solicitante inserido com ID:', this.lastID);
                    
                    // Inserir solicitação de teste
                    const solicitanteId = this.lastID;
                    db.run(`INSERT INTO requests (user_id, nome_criancas, quantidade, serie, ciente, materiais, status) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [solicitanteId, 'Pedro Santos, Ana Santos', 2, '5º ano', 'sim', '["Caderno","Mochila","Lápis de cor"]', 'pendente'],
                        function(err) {
                            if (err) {
                                console.error('❌ Erro ao inserir solicitação:', err);
                            } else {
                                console.log('✅ Solicitação inserida com ID:', this.lastID);
                            }
                        }
                    );
                }
            }
        );
        
        // Aguardar um pouco e depois listar os dados
        setTimeout(() => {
            console.log('\n4. Listando dados inseridos...');
            listAllData();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

function listAllData() {
    // Listar usuários
    db.all('SELECT id, nome, email, type, cidade FROM users', (err, users) => {
        if (err) {
            console.error('❌ Erro ao listar usuários:', err);
        } else {
            console.log('\n📋 USUÁRIOS:');
            console.table(users);
        }
    });
    
    // Listar doações
    db.all('SELECT id, user_id, items, points, cras, created_at FROM donations', (err, donations) => {
        if (err) {
            console.error('❌ Erro ao listar doações:', err);
        } else {
            console.log('\n📦 DOAÇÕES:');
            console.table(donations);
        }
    });
    
    // Listar solicitações
    db.all('SELECT id, user_id, nome_criancas, materiais, status, created_at FROM requests', (err, requests) => {
        if (err) {
            console.error('❌ Erro ao listar solicitações:', err);
        } else {
            console.log('\n📝 SOLICITAÇÕES:');
            console.table(requests);
        }
        
        // Fechar conexão
        setTimeout(() => {
            db.close();
            console.log('\n✅ Teste concluído!');
            console.log('\n📌 Credenciais de teste:');
            console.log('   Doador: joao@teste.com / teste123');
            console.log('   Solicitante: maria@teste.com / teste123');
        }, 100);
    });
}