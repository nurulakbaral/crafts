import * as React from "react";
import { accountService, commodityService } from "~/features/account/services";

function Commodity() {
	const [queryList, setQueryList] = React.useState(commodityService.queryUserList());
	return (
		<div className="mx-20 border p-6">
			<h2>Commodity</h2>

			<div className="inline-flex gap-4">
				<button
					className="bg-gray-100 p-2 rounded-md"
					type="button"
					onClick={() => {
						commodityService.changeFirstUserName(`New Name: ${Math.random()}`);
					}}
				>
					Change First User
				</button>

				<button
					className="bg-gray-100 p-2 rounded-md"
					type="button"
					onClick={() => {
						commodityService.invalidateUserList();
					}}
				>
					Invalidate User List
				</button>
			</div>

			<code>{JSON.stringify(queryList?.[0], null, 2)}</code>
			<button
				className="bg-gray-100 p-2 rounded-md"
				type="button"
				onClick={() => {
					setQueryList(commodityService.queryUserList());
				}}
			>
				Refresh
			</button>
		</div>
	);
}

function UserList() {
	const responseUserList = accountService.useUserList();

	return (
		<div className=" border p-6 mb-2">
			<h1>Service Page</h1>
			<code>{JSON.stringify(responseUserList.data?.[0], null, 2)}</code>
		</div>
	);
}

export function ServicePage() {
	return (
		<div className="m-10 border border-green-400 p-6">
			<p className="text-center mb-10">Service Page</p>

			<UserList />

			<Commodity />
		</div>
	);
}
