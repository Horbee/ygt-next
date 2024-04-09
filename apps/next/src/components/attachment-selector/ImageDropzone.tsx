import { useState } from "react";
import { ArrowUpFromLine, Image, Trash, UploadCloud, X } from "lucide-react";

import {
  Box,
  Button,
  Flex,
  Group,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import { WithBackgroundImage } from "./WithBackgroundImage";

import type { DropzoneProps } from "@mantine/dropzone";

type ImageState = { file?: File; imgSrc?: string };

interface Props extends Partial<DropzoneProps> {
  uploadImage: (file: File) => Promise<void>;
}

export function ImageDropzone({ uploadImage, ...props }: Props) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const [image, setImage] = useState<ImageState>({});

  const handleDrop = (files: File[]) => {
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = () => {
        setImage({ file: files[0], imgSrc: fr.result as string });
      };
      fr.readAsDataURL(files[0]!);
    }
  };

  const handleDelete = () => setImage({});

  const handleUpload = async () => {
    if (image.file) {
      await uploadImage(image.file);
      setImage({});
    }
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        {...props}
      >
        <WithBackgroundImage imgSrc={image.imgSrc}>
          <Group
            align="center"
            gap="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <ArrowUpFromLine
                size={50}
                color={theme.colors[theme.primaryColor]![colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <X size={50} color={theme.colors.red[colorScheme === "dark" ? 4 : 6]} />
            </Dropzone.Reject>

            {!image.imgSrc && (
              <>
                <Dropzone.Idle>
                  <Image size={50} />
                </Dropzone.Idle>

                <Box ta={{ base: "left", xs: "center" }}>
                  <Text size="xl" inline>
                    Drag image here or click to select file
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    File size should not exceed 5mb
                  </Text>
                </Box>
              </>
            )}
          </Group>
        </WithBackgroundImage>
      </Dropzone>

      <Flex justify="flex-end" mt="xs" gap="xs">
        <Button
          color="blue"
          size="sm"
          leftSection={<UploadCloud size={16} />}
          onClick={handleUpload}
          disabled={!image.file}
        >
          Upload
        </Button>
        <Button
          variant="outline"
          color="red"
          size="sm"
          onClick={handleDelete}
          leftSection={<Trash size={16} />}
          disabled={!image.file}
        >
          Remove Image
        </Button>
      </Flex>
    </>
  );
}
