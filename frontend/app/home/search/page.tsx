"use client"
import React, { useState } from "react"
import { PlusIcon } from "@/icons/icons"
import Button from "@/ui/Button"
import InputSearch from "@/app/components/ui/InputSearch"
import Link from "next/link"
import FiltersGroup from "@/app/components/search/FiltersGroup"
import { useFilterSearchStore } from "@/app/store/filterSearch"
import RatingStars from "@/app/components/ui/RatingStars"
import PostsFiltered from "@/app/components/search/PostsFiltered"
import Users from "@/app/components/search/Users"

function Search({
	searchParams
}: {
	searchParams?: {
		query?: string
	}
}) {
	const params = searchParams?.query ? searchParams.query : ""
	const { filterSearh, setFilterSearh } = useFilterSearchStore(state => state)
	const [rating, setRating] = useState<null | number>(null)
	const [isFilterActive, setIsFilterActive] = useState(false)
	const contentIsPosts = filterSearh.filter[0] != "user"

	const handleFilterState = () => {
		setIsFilterActive(!isFilterActive)
	}

	const handleChangeRating = (value: number) => {
		if (value === rating) {
			setRating(null)
		} else {
			setRating(value)
		}
	}

	const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

	return (
		<>
			<section className='flex flex-col items-center w-full gap-5'>
				<div className='flex flex-col justify-center items-center w-full max-w-md'>
					<InputSearch />
					<div className='flex items-center justify-center border-b border-white/40 w-full'>
						<FiltersGroup
							filter={filterSearh.filter[0]}
							setFilter={setFilterSearh}
						/>
					</div>
				</div>
				{contentIsPosts ? (
					<PostsFiltered search={params} rating={rating}/>
				) : (
					<Users />
				)}
			</section>
			<section
				className={`fixed top-0 right-0 h-screen max-w-[200px] flex flex-col justify-between items-center py-5 px-5 gap-2`}
			>
				{contentIsPosts && (
					<>
						<Button
							className='px-3 ml-auto'
							color={`${isFilterActive ? "secondary" : "primary"}`}
							startContent={<PlusIcon />}
							onClick={handleFilterState}
						>
							Filtrar
						</Button>
						<div
							className={`${
								isFilterActive
									? "w-[250px] h-full flex flex-col bg-seagreen-900 dark:bg-storm-950 dark:ring-white/40 dark:ring-1 rounded-l-xl text-white p-3 gap-5"
									: ""
							}`}
						>
							{isFilterActive && (
								<>
									<p className='text-lg text-center font-medium'>Calificacion</p>
									<div className='flex flex-col gap-5 ml-5 mr-auto'>
										{ratings.map(rat => (
											<button
												key={rat}
												className={`hover:bg-storm-50/30 rounded-lg px-2 py-1 ${rat === rating && 'bg-storm-50/20'}`}
												onClick={() => handleChangeRating(rat)}
											>
												<RatingStars rating={rat} />
											</button>
										))}
									</div>
								</>
							)}
						</div>
					</>
				)}
				<Link
					href={"/home/create"}
					className={`ml-auto ${!contentIsPosts && 'mt-auto'}`}
				>
					<Button
						className='px-3'
						startContent={<PlusIcon />}
					>
						Crear
					</Button>
				</Link>
			</section>
		</>
	)
}

export default Search
