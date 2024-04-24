function cal(monthIndex = -1, year = -1) {
	// month calendar ... x 7, starts with Sunday
	const result = new Array()
	const now = new Date()
	// 0 - January, ..., 11 - December
	monthIndex = monthIndex >= 0 
		? monthIndex % 11 : now.getMonth()
	// e.g., 2024
	year = year >= 0 ? year : now.getFullYear()
	
	// header
	result[0] = new Array('Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa')
	// using 0 as day gives the last day of the prior month
	// 1 ... 31
	const daysInMonth = new Date(year, (monthIndex + 1) % 11, 0)
        .getDate()

	let currentWeek
	for(let i = 1; i <= daysInMonth; i++) {
		// a new week
		if(!currentWeek) {
			currentWeek = new Array(7).fill('  ')
			result.push(currentWeek)
		}
		
		const date = new Date(year, monthIndex, i)
		// 0 - sunday, 1- monday, ...
		const day = date.getDay()
		currentWeek[day] = `${i}`.padStart(2, ' ')

		// reset week
		if(day === 6) {
			currentWeek = null
		}
	}

	return result
}

// current month
console.table(cal())

// Feb 2024
console.table(cal(3, 2024))