"use client"
import React, { useState } from "react"
import { FilterIcon, PlusIcon } from "@/icons/icons"
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
					<div className="max-w-[80%] w-full sm:max-w-md mr-auto sm:mr-0">
						<InputSearch />
					</div>
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
					<Users search={params} rating={rating}/>
				)}
			</section>
			<section
				className={`fixed ${contentIsPosts ? 'top-0 right-0' : 'hidden'} max-w-[100px] sm:max-w-[200px] flex flex-col justify-between items-center pt-[18px] pr-5 gap-2 `}
			>
				{contentIsPosts && (
					<>
						<Button
							className='px-3 ml-auto'
							color={`${isFilterActive ? "secondary" : "primary"}`}
							startContent={<FilterIcon />}
							onClick={handleFilterState}
						>
							<p className="hidden lg:block">
								Filtrar
							</p>
						</Button>
						<div
							className={`${
								isFilterActive
									? "w-[250px] h-full flex flex-col bg-seagreen-900 dark:bg-storm-950 dark:ring-white/40 dark:ring-1 rounded-l-xl text-white p-3 gap-3 sm:gap-5"
									: ""
							}`}
						>
							{isFilterActive && (
								<>
									<p className='text-lg text-center font-medium'>Calificacion</p>
									<div className='flex flex-col gap-3 sm:gap-4 ml-5 mr-auto'>
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
			</section>
			<Link href={"/home/create"}>
				<Button
					className='fixed bottom-12 md:bottom-5 right-5 px-3'
					startContent={<PlusIcon />}
				>
					<p className="hidden lg:block">
						Crear
					</p>
				</Button>
			</Link>
		</>
	)
}

export default Search
