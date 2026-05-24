import {
	ActionIcon,
	type ActionIconProps,
	type ElementProps,
	Group,
	Select,
	Stack,
	type StackProps,
	Text,
	Textarea,
	type TextareaProps,
	Title,
} from "@mantine/core";
import { CheckIcon, CpuIcon } from "@phosphor-icons/react";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";
import { cx } from "~/libraries";
import { useStoreConv } from "~/stores";

type TComposerSendProps = {} & ElementProps<"button"> & ActionIconProps;

function ComposerSend({ ...props }: TComposerSendProps) {
	return (
		<ActionIcon size={32} {...props}>
			<ArrowUpIcon size={16} />
		</ActionIcon>
	);
}

function ComposerModel() {
	const models = {
		"mistral-large-latest": {
			code: "mistral-large-latest",
			label: "Mistral Large Latest",
			description: "Flexible, powerful language model",
		},
		"mistral-medium-latest": {
			code: "mistral-medium-latest",
			label: "Mistral Medium Latest",
			description: "Responsive everyday work",
		},

		"mistral-small-latest": {
			code: "mistral-small-latest",
			label: "Mistral Small Latest",
			description: "Fast and efficient language model",
		},
	};

	return (
		<Select
			variant="unstyled"
			allowDeselect={false}
			classNames={{
				wrapper: "hover:bg-gray-100 rounded-md",
			}}
			leftSection={<CpuIcon size={16} />}
			rightSection={null}
			defaultValue="mistral-medium-latest"
			data={[
				{ value: "mistral-large-latest", label: "Mistral Large Latest" },
				{ value: "mistral-medium-latest", label: "Mistral Medium Latest" },
				{ value: "mistral-small-latest", label: "Mistral Small Latest" },
			]}
			comboboxProps={{ width: 300, position: "bottom-end" }}
			renderOption={({ option, checked }) => (
				<Group justify="space-between" align="center" className="w-full">
					<Stack gap={2}>
						<Title className="text-sm font-medium">{models[option.value].label}</Title>
						<Text c="gray.6" className="text-xs">
							{models[option.value].description}
						</Text>
					</Stack>

					{checked && <CheckIcon size={12} />}
				</Group>
			)}
		/>
	);
}

type TComposerMessageProps = {} & TextareaProps & ElementProps<"textarea">;

function ComposerMessage({ ...props }: TComposerMessageProps) {
	return (
		<Textarea
			name="composer"
			id="composer"
			className="w-full bg-gray-100"
			classNames={{ input: "outline-none border-none text-base bg-gray-100" }}
			placeholder="Ask anything"
			autosize
			minRows={1}
			maxRows={16}
			{...props}
		/>
	);
}

type TComposerProps = {
	onSend: (message: string) => void;
	conversation: boolean;
} & ElementProps<"div"> &
	StackProps;

export function Composer({ conversation, onSend, className }: TComposerProps) {
	const storeConv = useStoreConv();
	const [message, setMessage] = React.useState("");

	return (
		<Stack
			gap={0}
			justify="space-between"
			align="flex-end"
			className={cx(
				"border-2 rounded-2xl border-gray-100 bg-gray-100 py-4 px-3",
				conversation ? "w-172" : "w-full",
				className,
			)}
		>
			<ComposerMessage value={message} onChange={(e) => setMessage(e.target.value)} />

			<Group className="h-full" gap={8}>
				<ComposerModel />

				<ComposerSend
					onClick={() => {
						onSend(message);
						setMessage("");
						storeConv.setStreaming(true);
					}}
				/>
			</Group>
		</Stack>
	);
}
