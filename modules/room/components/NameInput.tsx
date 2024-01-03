import { FormEvent, useEffect, useState } from "react";

import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "@/modules/home/modals/NotFound";

const NameInput = () => {
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();

  const [name, setName] = useState("");

  const router = useRouter();
  const roomId = (router.query.roomId || "").toString();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      if (!exists) {
        router.push("/");
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off("room_exists");
    };
  }, [roomId, router]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) {
        router.push("/");
        openModal(<NotFoundModal id={roomIdFromServer} />);
      } else setRoomId(roomIdFromServer);
    };

    socket.on("joined", handleJoined);

    return () => {
      socket.off("joined", handleJoined);
    };
  }, [openModal, router, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("join_room", roomId, name);
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-surface">
      <div className="flex flex-col items-center justify-center">
        <h1 className="visually-hidden">Shared Canvas</h1>
        <video width="430" height="300" autoPlay muted>
          <source src="/video/shared-canvas.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="relative bottom-4 w-full rounded-3xl border-x-[7px] border-b-[7px] border-secondary sm:w-auto md:bottom-10">
        <div className="h-full w-full rounded-b-3xl border-x-[3px] border-b-[3px] border-surface bg-white sm:w-[416px] md:h-[20rem] md:rounded-t-none">
          <div className={"flex h-full w-full items-center justify-center"}>
            <form className="" onSubmit={handleJoinRoom}>
              <div className="flex w-full flex-col gap-5 p-8 md:min-w-[300px]">
                <Input
                  variant="faded"
                  label="Enter your nickname"
                  id="room-id"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 15))}
                />
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button color="secondary" type="submit">
                    Enter Room
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInput;
