// backend/check-data.js
const db = require('./database');

console.log('=== VERIFICANDO DADOS NO BANCO ===\n');

// Usuários
db.all('SELECT id, nome, email, type, cidade, telefone FROM users', (err, users) => {
    if (err) {
        console.error('❌ Erro ao buscar usuários:', err);
    } else {
        console.log('👥 USUÁRIOS CADASTRADOS:');
        if (users.length === 0) {
            console.log('   Nenhum usuário cadastrado ainda.');
        } else {
            console.table(users);
        }
    }
    
    // Doações
    db.all(`SELECT d.id, u.nome as doador, d.items, d.points, d.cras, d.data_entrega, d.created_at 
            FROM donations d 
            JOIN users u ON d.user_id = u.id`, (err, donations) => {
        if (err) {
            console.error('❌ Erro ao buscar doações:', err);
        } else {
            console.log('\n📦 DOAÇÕES REGISTRADAS:');
            if (donations.length === 0) {
                console.log('   Nenhuma doação registrada ainda.');
            } else {
                console.table(donations);
                
                // Calcular total de pontos
                db.get('SELECT SUM(points) as total FROM donations', (err, result) => {
                    if (!err && result.total) {
                        console.log(`\n💰 Total de pontos distribuídos: ${result.total}`);
                    }
                });
            }
        }
        
        // Solicitações
        db.all(`SELECT r.id, u.nome as solicitante, r.nome_criancas, r.quantidade, 
                r.serie, r.materiais, r.status, r.created_at 
                FROM requests r 
                JOIN users u ON r.user_id = u.id`, (err, requests) => {
            if (err) {
                console.error('❌ Erro ao buscar solicitações:', err);
            } else {
                console.log('\n📝 SOLICITAÇÕES REGISTRADAS:');
                if (requests.length === 0) {
                    console.log('   Nenhuma solicitação registrada ainda.');
                } else {
                    console.table(requests);
                }
                
                // Estatísticas
                console.log('\n📊 ESTATÍSTICAS:');
                
                // Total de usuários por tipo
                db.all('SELECT type, COUNT(*) as total FROM users GROUP BY type', (err, stats) => {
                    if (!err) {
                        stats.forEach(stat => {
                            console.log(`   ${stat.type === 'doador' ? 'Doadores' : 'Solicitantes'}: ${stat.total}`);
                        });
                    }
                });
                
                // Fechar conexão após todas as consultas
                setTimeout(() => {
                    db.close();
                    console.log('\n✅ Verificação concluída!');
                }, 500);    
            }
        });
    });
});