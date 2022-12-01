import React from 'react';

const AlertaMensagem = ({ status, mensagem } ) => {
  return (
    <div>
        <p className={`alerta alerta-${status}`}>{mensagem}</p>
    </div>
  );
};

export default AlertaMensagem;