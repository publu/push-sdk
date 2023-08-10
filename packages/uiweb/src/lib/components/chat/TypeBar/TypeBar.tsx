import { useClickAway, useDeviceWidthCheck } from "../../../hooks";
import type { FileMessageContent } from "../../../types";
import type { ChatMainStateContextType } from "../../../context/chatAndNotification/chat/chatMainStateContext";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { GIFType, TypeBarProps } from "../exportedTypes";
import styled from "styled-components";
import { PUBLIC_GOOGLE_TOKEN, device } from "../../../config";
import { Section, Div } from "../../reusables";
import { EmojiIcon } from "../../../icons/Emoji";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import * as PUSHAPI from "@pushprotocol/restapi";
import { GifIcon } from "../../../icons/Gif";
import GifPicker from "gif-picker-react";
import { AttachmentIcon } from "../../../icons/Attachment";
import usePushSendMessage from "./usePushSendMessage";
import { SendIcon } from "../../../icons/Send";
import { Spinner } from "../../reusables";
import { ThemeContext } from "../theme/ThemeProvider";

export const TypeBar: React.FC<TypeBarProps> = ({ conversationId, Emoji = true, GIF = true, File = true }) => {
    const [typedMessage, setTypedMessage] = useState<string>("");
    const [showEmojis, setShowEmojis] = useState<boolean>(false);
    const [gifOpen, setGifOpen] = useState<boolean>(false);
    const [newChat, setNewChat] = useState<boolean>(false);
    const modalRef = useRef(null);
    const fileUploadInputRef = useRef<HTMLInputElement>(null);
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const onChangeTypedMessage = (val: string) => {
        if (val.trim() !== '') setTypedMessage(val);
    };
    const theme = useContext(ThemeContext);
    const isMobile = useDeviceWidthCheck(425);
    const { sendMessage, loading } = usePushSendMessage();

    useClickAway(modalRef, () => {
        setShowEmojis(false);
        setGifOpen(false);
    });
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textAreaRef?.current?.style) {
            textAreaRef.current.style.height = 25 + 'px';
            const scrollHeight = textAreaRef.current?.scrollHeight;
            textAreaRef.current.style.height = scrollHeight + 'px';
        }
    }, [textAreaRef, typedMessage])

    const addEmoji = (emojiData: EmojiClickData, event: MouseEvent): void => {
        setTypedMessage(typedMessage + emojiData.emoji);
        setShowEmojis(false);
    }

    const handleUploadFile = () => {
        if (fileUploadInputRef.current) {
            fileUploadInputRef.current.click();
        }
    }

    const uploadFile = async (
        e: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        if (!e.target.files) {
            return;
        }
        if (
            e.target &&
            (e.target as HTMLInputElement).files &&
            ((e.target as HTMLInputElement).files as FileList).length
        ) {
            const file: File = e.target.files[0];
            if (file) {
                try {
                    const TWO_MB = 1024 * 1024 * 2;
                    if (file.size > TWO_MB) {
                        console.log('Files larger than 2mb is now allowed');
                        throw new Error('Files larger than 2mb is now allowed');
                    }
                    setFileUploading(true);
                    const messageType = file.type.startsWith('image') ? 'Image' : 'File';
                    const reader = new FileReader();
                    let fileMessageContent: FileMessageContent;
                    reader.readAsDataURL(file);
                    reader.onloadend = async (e): Promise<void> => {
                        fileMessageContent = {
                            content: e.target!.result as string,
                            name: file.name,
                            type: file.type,
                            size: file.size,
                        };

                        sendPushMessage(JSON.stringify(fileMessageContent), messageType);
                    };
                } catch (err) {
                    console.log(err);
                } finally {
                    setFileUploading(false);
                }
            }
        }
    };

    const sendPushMessage = async (content: string, type: string) => {
        try {
            await sendMessage({
                message: content,
                receiver: conversationId,
                messageType: type as any,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const sendTextMsg = async () => {
        if (typedMessage.trim() !== '') {
            await sendPushMessage(typedMessage as string, 'Text');
            setTypedMessage('');
        }
    }

    const sendGIF = async (emojiObject: GIFType) => {
        sendPushMessage(emojiObject.url as string, 'GIF');
        setGifOpen(false);
    }


    return (
        <Container theme={theme}>
            <TypebarSection
                borderColor="#DDDDDF"
                borderStyle="solid"
                borderWidth="1px"
                borderRadius="8px"
                padding="12px 17px 15px 17px"
                background="#fff"
                alignItems="center"
                justifyContent="space-between"
            >
                <Section gap="8px" flex="1">
                    {Emoji &&
                        <Div
                            width="20px"
                            cursor="pointer"
                            height="20px"
                            alignSelf="end"
                            onClick={() => setShowEmojis(!showEmojis)}
                        >
                            <EmojiIcon />
                        </Div>
                    }
                    {showEmojis && (
                        <Section
                            ref={modalRef}
                            position="absolute"
                            bottom="3.5rem"
                            left="3.5rem"
                        ><EmojiPicker
                                width={isMobile ? 260 : 320}
                                height={370}
                                onEmojiClick={addEmoji}
                            />
                        </Section>
                    )}
                    <MultiLineInput
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                sendTextMsg();
                            }
                        }}
                        placeholder="Type your message..."
                        onChange={(e) => setTypedMessage(e.target.value)}
                        value={typedMessage}
                        ref={textAreaRef}
                        rows={1}
                    />
                </Section>
                <SendSection>
                    {GIF &&
                        <Section
                            width="34px"
                            height="24px"
                            cursor="pointer"
                            alignSelf="end"
                            onClick={() => setGifOpen(!gifOpen)}>
                            <GifIcon />
                        </Section>
                    }
                    {gifOpen && (
                        <Section
                            position="absolute"
                            bottom="3.5rem"
                            right={isMobile ? '5rem' : '8rem'}
                            ref={modalRef}>
                            <GifPicker
                                onGifClick={sendGIF}
                                width={isMobile ? 260 : 320}
                                height={370}
                                tenorApiKey={String(PUBLIC_GOOGLE_TOKEN)}
                            />
                        </Section>
                    )}
                    <Section onClick={handleUploadFile}>
                        {!fileUploading && File && (
                            <>
                                <Section
                                    width="17"
                                    height="24px"
                                    cursor="pointer"
                                    alignSelf="end"
                                    onClick={() => setNewChat(true)}
                                >
                                    <AttachmentIcon />
                                </Section>
                                <FileInput
                                    type="file"
                                    ref={fileUploadInputRef}
                                    onChange={(e) => uploadFile(e)}
                                />
                            </>
                        )}
                    </Section>
                    {!(loading || fileUploading) && (
                        <Section
                            cursor="pointer"
                            alignSelf="end"
                            height="24px"
                            onClick={() => sendTextMsg()}
                        >
                            <SendIcon />
                        </Section>
                    )}

                    {(loading || fileUploading) && (
                        <Section alignSelf="end" height="24px">
                            <Spinner size="22" />
                        </Section>
                    )}
                </SendSection>
            </TypebarSection>
        </Container>
    )
}

const Container = styled.div`
  width: 100%;
  border-top: 1px solid #dddddf;
  overflow: hidden;
  padding: 15px 0px;
`;
const TypebarSection = styled(Section)`
  gap: 10px;
  @media ${device.mobileL} {
    gap: 0px;
  }
`;
const SendSection = styled(Section)`
  gap: 11.5px;
  @media ${device.mobileL} {
    gap: 7.5px;
  }
`;
const MultiLineInput = styled.textarea`
  font-family: inherit;
  font-weight: 400;
  transform: translateY(3px);
  font-size: 16px;
  outline: none;
  overflow-y: auto;
  box-sizing: border-box;
  border: none;
  color: #000;
  resize: none;
  flex: 1;
  padding-right: 5px;
  align-self: end;
  @media ${device.mobileL} {
    font-size: 14px;
  }
  &&::-webkit-scrollbar {
    width: 4px;
    padding-right: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
    height: 50px;
  }
  ::placeholder {
    color: #000;
    transform: translateY(1px);
    @media ${device.mobileL} {
      font-size: 14px;
    }
  }

  min-height: 25px;
  max-height: 80px;
  word-break: break-word;
`;
const FileInput = styled.input`
  display: none;
`;