"use client";
import { useEffect, useState } from "react";
import { DateSort } from "@tbd54566975/dwn-sdk-js";
import { RingLoader } from "react-spinners";
import useSystemTheme from "@/hooks/useSystemTheme";
import useWeb5 from "@/hooks/useWeb5";
import usePhotos from "@/hooks/usePhotos";
import { AnimatePresence, motion, wrap } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Compressor from "compressorjs";
import { isMobile } from "react-device-detect";
import MyRingLoader from "@/components/MyRingLoader";
import { imageCache } from "@/components/GridItem";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function CarouselPage({
  params,
}: {
  params: { index: string };
}) {
  const router = useRouter();
  const systemTheme = useSystemTheme();
  const { web5 } = useWeb5();

  const { photos } = usePhotos();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [[page, direction], setPage] = useState([parseInt(params.index), 0]);
  const imageIndex = wrap(0, photos.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  async function fetchImage() {
    if (photos && photos[imageIndex]) {
      if (imageCache[photos[imageIndex].contentUrl] && !isMobile) {
        setPhotoUrl(
          URL.createObjectURL(imageCache[photos[imageIndex].contentUrl])
        );
        return;
      }

      setPhotoUrl(null);

      if (web5) {
        const blobResult = await web5.dwn.records.read({
          message: {
            recordId: photos[imageIndex].contentUrl,
          },
        });

        const blob = await blobResult.record!.data.blob();

        new Compressor(blob, {
          quality: 0.4,
          success(file) {
            setPhotoUrl(URL.createObjectURL(file));
            // Save the fetched blob into the cache
            // if (!isMobile)
            imageCache[imageIndex] = file;
          },
        });
      }
    }
  }

  useEffect(() => {
    fetchImage();
  }, [web5, imageIndex, page, photos]);

  return (
    <div className="h-screen w-screen relative bg-white flex flex-col items-center justify-center dark:bg-black">
      <Button
        className="absolute top-0 right-0 m-4 w-10 rounded-full p-0 z-30"
        onClick={() => {
          router.back();
        }}
      >
        <X />
      </Button>

      {photoUrl ? (
        <>
          <div className="h-full w-full relative flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                // className="absolute max-w-screen"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "scale-down",
                  position: "absolute",
                }}
                key={page}
                src={photoUrl}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
              />
            </AnimatePresence>
            <div className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-30 mr-4">
              <Button onClick={() => paginate(1)}>
                <ChevronRight />
              </Button>
            </div>
            <div className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-30 ml-4">
              <Button onClick={() => paginate(-1)}>
                <ChevronLeft />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <MyRingLoader />
      )}
    </div>
  );
}
