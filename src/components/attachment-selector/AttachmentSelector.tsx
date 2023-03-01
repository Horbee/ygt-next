import axios from "axios";
import { useState } from "react";
import { BsCardImage, BsCloudUpload } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { Button, Flex, Group, Image, Modal, Paper, Tabs, Text } from "@mantine/core";

import { api } from "../../utils/api";
import { ImageDropzone } from "./ImageDropzone";

type AttachmentTabs = "select" | "upload";

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export const AttachmentSelector = ({ opened, setOpened }: Props) => {
  const [activeTab, setActiveTab] = useState<AttachmentTabs>("select");
  const attachments = api.attachment.getAttachments.useQuery();
  const upload = api.attachment.createAttachment.useMutation();
  const utils = api.useContext();

  const uploadImage = async (file: File) => {
    const { preSignedUrl } = await upload.mutateAsync({
      fileName: file.name,
      fileType: file.type,
    });

    const uploadPromise = axios.put(preSignedUrl, file, {
      headers: { "Content-Type": file.type },
    });

    await toast.promise(uploadPromise, {
      pending: "Uploading Image...",
      success: "Image uploaded 👌",
      error: "Image can not be uploaded 🤯",
    });

    setActiveTab("select");
    utils.attachment.getAttachments.invalidate();
  };

  return (
    <Modal
      size="70%"
      opened={opened}
      onClose={() => setOpened(false)}
      title="Manage Attachments"
    >
      {/* Modal content */}
      <Paper shadow="xs" p="md" withBorder style={{ flexGrow: 1 }}>
        <Tabs value={activeTab} onTabChange={(tab: AttachmentTabs) => setActiveTab(tab)}>
          <Tabs.List>
            <Tabs.Tab value="select" icon={<BsCardImage size={14} />}>
              Select
            </Tabs.Tab>
            <Tabs.Tab value="upload" icon={<BsCloudUpload size={14} />}>
              Upload
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="select" pt="xs">
            <Group>
              {attachments.data?.map((a) => (
                <Image
                  key={a.id}
                  radius="md"
                  width={100}
                  height={100}
                  src={a.url}
                  caption={
                    <Text lineClamp={2} title={a.name}>
                      {a.name}
                    </Text>
                  }
                />
              ))}
            </Group>

            <Flex py="xs" align="center" justify="flex-end" gap="xs">
              <Button>Select</Button>
              <Button variant="outline" color="red" size="sm" leftIcon={<FaTrash />}>
                Delete
              </Button>
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="upload" pt="xs">
            <ImageDropzone uploadImage={uploadImage} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Modal>
  );
};
