import { FormEvent, useEffect, useState } from "react";

import { Button, Input } from "@nextui-org/react";
import clsx from "clsx";
import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";

import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(0);

  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-surface">
      <div className="flex flex-col items-center justify-center">
        <h1 className="visually-hidden">Shared Canvas</h1>
        <video width="430" height="300" autoPlay muted>
          <source src="/video/shared-canvas.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="relative bottom-10 ml-[1px] rounded-3xl border-x-[7px] border-b-[7px] border-secondary">
        <div className="h-full w-full rounded-b-3xl rounded-t-xl border-x-[3px] border-b-[3px] border-surface bg-white md:h-[20rem] md:w-[416px] md:rounded-t-none">
          <div
            className={clsx(
              "flex h-full w-full",
              step === 0
                ? "items-center justify-center"
                : " flex-col items-center justify-start",
            )}
          >
            {step === 0 ? (
              <div className="flex w-full flex-col gap-5 p-8 md:min-w-[300px]">
                <Input
                  variant="faded"
                  label="Enter your nickname"
                  id="room-id"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.slice(0, 15))}
                />
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button color="secondary" onClick={() => setStep(1)}>
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col gap-5 p-8 md:min-w-[300px]">
                <form
                  className="flex flex-col items-center gap-3"
                  onSubmit={handleJoinRoom}
                >
                  <Input
                    variant="faded"
                    label="Enter room id"
                    id="room-id"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button color="secondary" type="submit">
                      Join
                    </Button>
                  </div>
                </form>

                <div className="my-2 flex w-full items-center gap-2">
                  <div className="h-px w-full bg-success" />
                  <p className="text-success">or</p>
                  <div className="h-px w-full bg-success" />
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <h5 className="font-bold leading-tight">Create new room</h5>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button color="secondary" onClick={handleCreateRoom}>
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
