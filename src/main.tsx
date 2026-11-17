import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { instalarCapturaDeErros } from './lib/reportarErro';
import { iniciarMedicao } from './lib/medicao';

// Quebra de tela aqui é venda perdida em silêncio: é nesta landing que o interessado se
// cadastra. Agora vira alerta no WhatsApp e demanda no painel.
instalarCapturaDeErros();
// Visitas, origem e cliques (sem cookie), gravados no painel. Ver lib/medicao.ts.
iniciarMedicao();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
