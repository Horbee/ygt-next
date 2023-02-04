import { ReactNode } from "react";
import { FaTrash } from "react-icons/fa";
import { MdFileUpload, MdImage, MdOutlineClose } from "react-icons/md";

import {
  BackgroundImage,
  Button,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import type { DropzoneProps } from "@mantine/dropzone";
interface Props extends Partial<DropzoneProps> {
  imgSrc?: string;
  setImage: (file: File | null, url: string | null) => void;
}

export function ImageDropzone({ imgSrc, setImage, ...restProps }: Props) {
  const theme = useMantineTheme();

  const handleDrop = (files: File[]) => {
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        setImage(files[0]!, fr.result as string);
      };
      fr.readAsDataURL(files[0]!);
    }
  };

  const handleDelete = () => {
    setImage(null, null);
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        {...restProps}
      >
        <WithBackgroundImage imgSrc={imgSrc}>
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <MdFileUpload
                size={50}
                color={
                  theme.colors[theme.primaryColor]![
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <MdOutlineClose
                size={50}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>

            {!imgSrc && (
              <>
                <Dropzone.Idle>
                  <MdImage size={50} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Drag image here or click to select file
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    File size should not exceed 5mb
                  </Text>
                </div>
              </>
            )}
          </Group>
        </WithBackgroundImage>
      </Dropzone>
      <Button
        variant="outline"
        color="red"
        size="sm"
        onClick={handleDelete}
        leftIcon={<FaTrash />}
      >
        Remove Image
      </Button>
    </>
  );
}

const WithBackgroundImage = ({
  imgSrc,
  children,
}: {
  imgSrc?: string;
  children: ReactNode;
}) => {
  return (
    <>
      {imgSrc ? (
        <BackgroundImage src={imgSrc} radius="sm">
          {children}
        </BackgroundImage>
      ) : (
        children
      )}
    </>
  );
};
