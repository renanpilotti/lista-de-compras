import './App.css';
import { useState, useEffect } from 'react';
import AlertaMensagem from './components/AlertaMensagem';
import Lista from './components/Lista';
import { FaPlus, FaRegTrashAlt, FaSpinner } from 'react-icons/fa';
import { categorias } from './dados/categorias';

const url = 'https://listinha.onrender.com';

function App() {

  const [alerta, setAlerta] = useState('');
  const [lista, setLista] = useState([]);
  const [nomeItem, setNomeItem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();

      setLista(data.sort((a, b) => a.indice - b.indice));
      setLoading(false)
    }
    getData();
  }, [])

  const mostrarMensagem = (show, status, mensagem) => {
    setAlerta({ show, status, mensagem });
    setTimeout(() => {
      setAlerta('');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeItem) {
      mostrarMensagem(true, 'erro', 'por favor, insira um valor.');
    } else {
      setLoading(true)
      let idItem = new Date().getTime().toString();
      let product = { idItem, nomeItem: nomeItem.trim().toLowerCase() };

      for (let i = 0; i < categorias.length; i++) {
        if (categorias[i].includes(product.nomeItem)) {
          product.indice = i;
          break;
        }
      }

      if (product.indice === undefined) {
        product.indice = categorias.length;
      }

      const res =
        await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(product)
        });

      const addedProduct = await res.json();
      setLista((prev) => [...prev, addedProduct].sort((a, b) => a.indice - b.indice));

      setNomeItem('');
      setLoading(false);
      mostrarMensagem(true, 'sucesso', 'YASSS!');
    };
  };

  const limparLista = async () => {
    setLoading(true);
    const res = await fetch(url, {
      method: "DELETE"
    });

    const clearList = await res.json();

    setLista(clearList);
    mostrarMensagem(true, 'erro', 'itens excluídos');
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className='title'>listinha</h1>
      <AlertaMensagem {...alerta} />
      <form onSubmit={handleSubmit}>
        {loading ? (<>
          <input type="text"
            placeholder='ex. banana'
            onChange={(e) => setNomeItem(e.target.value)}
            value={nomeItem}
            className='disabled'
            disabled />
          <button className='add-btn disabled' type='submit' disabled>
            <FaSpinner className={'spin'} />
          </button>
        </>) : (<>
          <input type="text"
            placeholder='ex. banana'
            onChange={(e) => setNomeItem(e.target.value)}
            value={nomeItem} />
          <button className='add-btn' type='submit'>
            <FaPlus />
          </button>
        </>)}

      </form>
      <Lista lista={lista} />

      {lista.length > 0 &&
        <div className="footer">
          {loading ?
            (<button className="clear-btn disabled" onClick={limparLista} disabled>
              <FaRegTrashAlt />
            </button>)
            :
            (<button className="clear-btn" onClick={limparLista}>
              <FaRegTrashAlt />
            </button>)}
        </div>}
    </div>
  );
}

export default App;