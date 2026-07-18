import dayjs from "dayjs";

type TRangeDate = {
	rangeDateParams: string | null;
	targetDate: string | null;
};

function rangeDate(rangeDateParams: TRangeDate["rangeDateParams"], targetDate: TRangeDate["targetDate"]) {
	const rangeDate = { start: rangeDateParams?.split(",")[0], end: rangeDateParams?.split(",")[1] };
	const defaultRangeDate = { start: dayjs(0), end: dayjs().add(100, "year") };
	const isValidRangeDate = dayjs(rangeDate.start).isValid() && dayjs(rangeDate.end).isValid();

	if (!targetDate || !isValidRangeDate) {
		return dayjs(targetDate).isBetween(defaultRangeDate.start, defaultRangeDate.end);
	}

	return dayjs(targetDate).isBetween(rangeDate.start, rangeDate.end, "day", "[]");
}

// ==========================================================================================
// @Exports
// ==========================================================================================

export const utilsApi = {
	rangeDate,
};
