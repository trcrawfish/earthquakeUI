

export const zipTemplate = {
			title: "{Label}",
			content: [
				{
					type: "fields",
					fieldInfos: [
						{
							fieldName: "TOTPOP_CY",
							label: "2020 Total Population",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "MALES_CY",
							label: "2020 Male Population",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "FEMALES_CY",
							label: "2020 Female Population",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "POPDENS_CY",
							label: "2020 Population (per sq mile)",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "TOTHH_CY",
							label: "2020 Total Households",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "AVGHHSZ_CY",
							label: "2020 Average Household Size",
							format: {
								digitSeparator: true,
								places: 2
							}
						},
						{
							fieldName: "AVGHINC_CY",
							label: "2020 Average Household Income",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "MEDHINC_CY",
							label: "2020 Median Household Income",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "AVGVAL_CY",
							label: "2020 Average Home Value",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "MEDVAL_CY",
							label: "2020 Median Home Value",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "TOTHU_CY",
							label: "2020 Total Housing Units",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "DPOPWRK_CY",
							label: "2020 Daytime Pop: Workers",
							format: {
								digitSeparator: true,
								places: 0
							}
						}																					
					]
				}
			]
		};

export const drivetimeTemplate = {
			title: "{bufferRadii} minute {areaType}",
			content: [
				{
					type: "fields",
					fieldInfos: [
						{
							fieldName: "TOTPOP_CY",
							label: "2020 Population",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "TOTHH_CY",
							label: "2020 Total Households",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "AVGHHSZ_CY",
							label: "2020 Average Household Size",
							format: {
								digitSeparator: true,
								places: 2
							}
						},
						{
							fieldName: "AVGHINC_CY",
							label: "2020 Average Household Income",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "AVGVAL_CY",
							label: "2020 Average Home Value",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "TOTHU_CY",
							label: "2020 Total Housing Units",
							format: {
								digitSeparator: true,
								places: 0
							}
						},
						{
							fieldName: "DPOPWRK_CY",
							label: "2020 Daytime Pop: Workers",
							format: {
								digitSeparator: true,
								places: 0
							}
						}															
					]
				}
			]
		};

export const locationTemplate = {
			title: "{name}",
			content: [
				{
					type: "fields",
					fieldInfos: [
						{
							fieldName: "lat",
							label: "Latitude",
							format: {
								digitSeparator: true,
								places: 8
							}
						},
						{
							fieldName: "lon",
							label: "Longitude",
							format: {
								digitSeparator: true,
								places: 8
							}
						}															
					]
				}
			]
		};