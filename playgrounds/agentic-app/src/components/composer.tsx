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
			className="w-full"
			classNames={{ input: "outline-none border-none text-base" }}
			placeholder="Ask anything"
			autosize
			minRows={2}
			maxRows={16}
			{...props}
		/>
	);
}

type TComposerProps = { onSend: (message: string) => void } & ElementProps<"div"> & StackProps;

export function Composer({ onSend }: TComposerProps) {
	const [message, setMessage] = React.useState("");

	return (
		<Stack gap={0} align="flex-end" className="w-160 border-2 rounded-2xl border-gray-100 py-4 px-3">
			<ComposerMessage value={message} onChange={(e) => setMessage(e.target.value)} />

			<Group gap={8}>
				<ComposerModel />
				<ComposerSend
					onClick={() => {
						onSend(message);
					}}
				/>
			</Group>
		</Stack>
	);
}
