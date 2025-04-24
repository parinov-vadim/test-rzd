import { useState, useRef, useEffect } from 'react'
import Schema1 from './PcFirstStorey.svg?react'
import Schema2 from './schema-2.svg?react'
import Schema3 from './schema-3.svg?react'

const SCHEMAS = [
    { name: 'Схема 1', component: Schema1 },
    { name: 'Схема 2', component: Schema2 },
    { name: 'Схема 3', component: Schema3 },
]
const DEFAULT_FREE_SEATS = [
    '22', '36', '15', '3', '14',  '8', '9','2'
]
function App() {
    const [selectedSchema, setSelectedSchema] = useState(SCHEMAS[0].name)
    const [freeSeats, setFreeSeats] = useState<string[]>(DEFAULT_FREE_SEATS)
    const schemaRef = useRef<SVGSVGElement>(null)
    const CurrentSchema = SCHEMAS.find(s => s.name === selectedSchema)?.component || Schema1


    const generateFreeSeats = () => {
        if (schemaRef.current) {
            freeSeats.forEach(seatNumber => {
                const seatId = `Seat${seatNumber}`
                const seatElement = schemaRef.current?.getElementById(seatId)
                if (seatElement) {
                    (seatElement as SVGElement).style.cssText += 'fill: #d1d5db !important;'
                }
            })
        }
        const newFreeSeats = new Set<string>()
        while (newFreeSeats.size < 8) {
            const randomSeat = Math.floor(Math.random() * 50) + 1
            newFreeSeats.add(randomSeat.toString())
        }
        setFreeSeats(Array.from(newFreeSeats))
    }

    const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

    const getWagonNumber = (seatNumber: string) => {
        const seatNum = parseInt(seatNumber, 10)
        return Math.ceil(seatNum / 4).toString()
    }

    const handleSeatMouseEnter = (event: Event) => {
        const seatElement = event.currentTarget as SVGPathElement
        const seatId = seatElement.id
        const seatNumber = seatId.replace('Seat', '')

        setHoveredSeat(seatNumber)
        const rect = seatElement.getBoundingClientRect()
        const svgRect = schemaRef.current?.getBoundingClientRect()

        if (svgRect) {
            setTooltipPosition({
                x: rect.left + rect.width / 2 - svgRect.left,
                y: rect.top - svgRect.top
            })
        }
    }
    const onClick = (event: Event) => {
        const seatElement = event.currentTarget as SVGPathElement
        const seatId = seatElement.id
        const seatNumber = seatId.replace('Seat', '')
        setSelectedSeats(prevSelectedSeats => {
            const isSelected = prevSelectedSeats.includes(seatNumber)
            if (isSelected) {
                seatElement.style.cssText += 'fill: #4dabf7 !important;'
                return prevSelectedSeats.filter(seat => seat !== seatNumber)
            } else {
                seatElement.style.cssText += 'fill: #ff0000 !important;'
                return [...prevSelectedSeats, seatNumber]
            }
        })
    }
    const handleSeatMouseLeave = () => {
        setHoveredSeat(null)
    }

    useEffect(() => {
        if (!schemaRef.current) return

        freeSeats.forEach(seatNumber => {
            const seatId = `Seat${seatNumber}`
            const seatElement = schemaRef.current?.getElementById(seatId)

            if (seatElement) {
                (seatElement as SVGElement).style.cursor = 'pointer';
                (seatElement as SVGElement).style.cssText += 'fill: #4dabf7 !important;'

                seatElement.addEventListener('click', onClick)
                seatElement.addEventListener('mouseenter', handleSeatMouseEnter)
                seatElement.addEventListener('mouseleave', handleSeatMouseLeave)
            }
        })

        return () => {
            freeSeats.forEach(seatNumber => {
                const seatId = `Seat${seatNumber}`
                const seatElement = schemaRef.current?.getElementById(seatId)

                if (seatElement) {
                    seatElement.removeEventListener('mouseenter', handleSeatMouseEnter)
                    seatElement.removeEventListener('mouseleave', handleSeatMouseLeave)
                    seatElement.removeEventListener('click', onClick)
                }
            })
        }
    }, [freeSeats])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex items-center justify-center py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl flex flex-col items-center">
                <div className="mb-6 w-full flex justify-center">
                    <select
                        value={selectedSchema}
                        onChange={e => {
                            setSelectedSchema(e.target.value)
                            generateFreeSeats()
                            setSelectedSeats([])
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-lg"
                    >
                        {SCHEMAS.map(schema => (
                            <option key={schema.name} value={schema.name}>
                                {schema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={generateFreeSeats}
                    className="mb-8 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold shadow transition duration-200"
                >
                    Сгенерировать свободные места
                </button>
                <div className="relative w-full flex flex-col items-center">
                    <div className="max-w-[1400px] w-full overflow-x-auto flex justify-center">
                        <CurrentSchema ref={schemaRef} />
                    </div>
                    {hoveredSeat && (
                        <div
                            className="absolute bg-gray-900 text-white px-4 py-2 rounded-lg text-base z-20 shadow-lg pointer-events-none"
                            style={{
                                left: `${tooltipPosition.x}px`,
                                top: `${tooltipPosition.y - 40}px`
                            }}
                        >
                            <span className="font-semibold">Место {hoveredSeat}</span>, Вагон {getWagonNumber(hoveredSeat)}
                        </div>
                    )}
                </div>
                <div className="mt-8 w-full flex flex-col items-center">
                    <div className="text-lg font-medium text-gray-700 mb-2">
                        Выбранные места: <span className="font-bold text-blue-600">{selectedSeats.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                            <span
                                key={seat}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold shadow"
                            >
                                {seat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App