import { useEffect, useState } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    lottery.methods
      .manager()
      .call()
      .then((res) => {
        setManager(res);
      });

    lottery.methods
      .getPlayers()
      .call()
      .then((res) => {
        setPlayers(res);
      });

    web3.eth.getBalance(lottery.options.address).then((balance) => {
      setBalance(balance);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    setMessage('You have been entered!');
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage('A winner has been picked!');
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. {'\n'}There are currently{' '}
        {players.length} people entered, competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h4>Ready to pick a winner</h4>
      <button onClick={onClick}>Pick a winner!</button>

      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
