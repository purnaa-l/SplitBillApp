import './index.css'; // Adjust the path according to your file structure
import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [handleFriend, setHandleFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null); // New state to track selected friend

  function handleSetHandleFriend() {
    setHandleFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend(friend); // Set selected friend
  }

  function handleSplitBill(value){
    //console.log(value);
    setFriends(friend  => 
      friend.map(friend => 
          friend.id === selectedFriend.id 
              ? { ...friend, balance: friend.balance + value } 
              : friend
      )
  );
  setSelectedFriend(null);
    }

  return (
    <div className="app">
      <div className="side-bar">
        <FriendsList friends={friends} onSelectFriend={handleSelectFriend} />
        {handleFriend && <AddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleSetHandleFriend}>{handleFriend ? 'Close' : 'Add Friend!'}</Button>
      </div>
      <SplitBillForm friend={selectedFriend} onSplitBill={handleSplitBill}/> {/* Pass selected friend here */}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelectFriend={onSelectFriend} />
      ))}
    </ul>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Friend({ friend, onSelectFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe your friend {Math.abs(friend.balance)} Euros</p>}
      {friend.balance > 0 && <p className="green">Your friend owes you {friend.balance} Euros</p>}
      {friend.balance === 0 && <p> {friend.name} and you are EVEN!</p>}
      <Button onClick={() => onSelectFriend(friend)}>Select</Button> {/* Pass the friend object */}
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=118836");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };
    onAddFriend(newFriend);
    setImage("https://i.pravatar.cc/48?u=118836");
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name: </label>
      <input type="text" placeholder="Enter Name here." value={name} onChange={(e) => setName(e.target.value)} />
      <label>Image URL: </label>
      <input type="text" placeholder="Add image here" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>Add Friend!</Button>
    </form>
  );
}

function SplitBillForm({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoPays, setWhoPays] = useState("user");

  if (!friend) return <p>Please select a friend to split the bill.</p>;

  function handleSubmit(e) {
    e.preventDefault();
    const userShare = Number(paidByUser);
    const friendShare = bill - userShare;
    
    // Validate inputs and ensure user share does not exceed bill
    if (!bill || !userShare || userShare > bill) return;

    // Determine the balance adjustment based on who paid
    const balanceChange = whoPays === "user" ? friendShare : -userShare;
    onSplitBill(balanceChange);
  }

  return (
    <form className="split-form-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label>Bill Value: </label>
      <input
        type="number"
        placeholder="Enter Bill here"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense: </label>
      <input
        type="number"
        placeholder="Enter Your Share"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(Math.min(Number(e.target.value), bill))
        }
      />

      <label>{friend.name}'s Expense: </label>
      <input type="text" disabled value={bill ? bill - paidByUser : ""} />

      <label>Who is paying the bill?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="friend">{friend.name}</option>
        <option value="user">You</option>
      </select>

      <Button>Add Expense</Button>
    </form>
  );
}
