import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, Circle } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
}

export function ImageCard({ src, alt, selected, onSelect }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={src}
                alt={alt}
                className="object-cover w-full h-64 group-hover:brightness-75 transition duration-300"
              />
            </CardContent>
          </Card>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect();
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
          >
            {selected ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <Circle className="text-gray-400" />
            )}
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-4xl max-h-[90vh] overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
}
