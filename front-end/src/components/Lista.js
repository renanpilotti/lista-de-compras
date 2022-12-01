const Lista = ({ lista }) => {
    return (
        <div>
            {lista.map((item) => {
                const { idItem, nomeItem } = item;
                return (
                <div className='item-lista' key={idItem}>
                    <div className='item-checkbox'>
                        <input type="checkbox" />
                        <label>{nomeItem}</label>
                    </div>
                </div>
                )
            })}
        </div>
    );
};

export default Lista;