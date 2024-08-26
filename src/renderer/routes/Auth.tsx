import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserButton({ name, setSelected }: { name: string; setSelected: any }) {
  return (
    <button
      onClick={() => setSelected(name)}
      type="button"
      className="hover:underline cursor-pointer text-left"
    >
      {name}
    </button>
  );
}

function SelectUser({ setSelected }: { setSelected: any }) {
  return (
    <>
      <UserButton setSelected={setSelected} name="Garv" />
      <UserButton setSelected={setSelected} name="Kivanc" />
      <UserButton setSelected={setSelected} name="Mo hamza g the third" />
    </>
  );
}

function Login({
  name,
  setSelected,
  setUser,
  user,
}: {
  name: string;
  setSelected: any;
  user: any;
  setUser: any;
}) {
  const [attempts, setAttempts] = useState(3);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = await window.electron.ipcRenderer.login(
      e.target.password.value,
    );
    if (result.success) {
      sessionStorage.setItem('sessionId', result.user.sessionId);
      setUser(result.user);
      navigate('/');
    }
    setAttempts((prev) => prev - 1);
  };

  useEffect(() => {
    if (attempts <= 0) {
      setUser(false);
    }
  }, [attempts, setUser]);

  useEffect(() => {
    if (user === false) {
      setAttempts(0);
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="cursor-pointer hover:underline"
        onClick={() => setSelected(null)}
        aria-label="Go back"
      >
        <ArrowLeftIcon />
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col px-1 gap-4">
        <label htmlFor="password" className="text-white">
          Welcome {name},<br /> please login
        </label>
        <div className="flex gap-2">
          <input disabled={user === false} id="password" type="password" />
          <button
            disabled={user === false}
            type="submit"
            className="p-2 border hover:opacity-80"
          >
            {' '}
            submit
          </button>
        </div>
        <p>{attempts} attempts left</p>
      </form>
    </div>
  );
}

export default function Auth({ setUser, user }: any) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="bg-black w-screen h-screen">
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-white ">relyvin</h1>
        <div className="flex flex-col gap-2 text-gray-500 ">
          {!selected ? (
            <SelectUser setSelected={setSelected} />
          ) : (
            <Login
              name={selected}
              setSelected={setSelected}
              setUser={setUser}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}
