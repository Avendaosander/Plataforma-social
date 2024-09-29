import { FilterPrimary, FilterSecondary } from "./types/types"
import { GetTechnology } from "./types/typesGraphql"

export const formatGraphQLErrors = (errors: any[]) => {
	return errors.map(error => `${error.message}`).join(", ")
}

export const existTech = (array: GetTechnology[], id: string) => {
	return array.some(item => item.id === id)
}

export const getTimeElapsed = (createdAt: any): string => {
	const createdAtMs =
		typeof createdAt === "number" ? createdAt : Number(createdAt)

	if (isNaN(createdAtMs)) {
		throw new Error("Invalid timestamp")
	}

	const now = Date.now()
	const diff = now - createdAtMs

	const minute = 60 * 1000
	const hour = 60 * minute
	const day = 24 * hour
	const week = 7 * day

	if (diff < minute) {
		return "Justo ahora"
	} else if (diff < hour) {
		const minutes = Math.floor(diff / minute)
		return `${minutes} min`
	} else if (diff < day) {
		const hours = Math.floor(diff / hour)
		return `${hours} h`
	} else if (diff < week) {
		const days = Math.floor(diff / day)
		return `${days} d`
	} else {
		const createdAtDate = new Date(createdAtMs)

		// Verificar si la fecha es del año actual
		const currentYear = new Date().getFullYear()
		const createdAtYear = createdAtDate.getFullYear()

		// Si es el mismo año
		if (currentYear === createdAtYear) {
			return `${createdAtDate.getDate()} de ${createdAtDate.toLocaleString(
				"es",
				{ month: "long" }
			)}`
		} else {
			// Si es de un año anterior
			return `${createdAtDate.getDate()} de ${createdAtDate.toLocaleString(
				"es",
				{ month: "long" }
			)} de ${createdAtYear}`
		}
	}
}

export const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) {
		return text
	}
	return text.slice(0, maxLength - 3) + "..."
}

export const arrayToFilterObject = (
	filter: [FilterPrimary, FilterSecondary],
	search: string,
	rating?: number | null
) => {
	const [primary, secondary] = filter

	const filterObj: { [key: string]: string | number } = {}
	filterObj[primary] = search

	if (secondary && rating) {
		filterObj["rating"] = rating 
	}

	return filterObj
}
