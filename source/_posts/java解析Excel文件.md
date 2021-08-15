---
title: java解析和编辑Excel文件
comment: true
date: 2020-08-21 22:40:25
tags: Java
categories:
- Java
- BackEnd
addrlink: 2242
---

Java解析Excel文件常用[Apache的POI](http://poi.apache.org/)

## Maven导入Jar包

```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>4.1.0</version>
</dependency>
```

## 解析简单表

先来个解析类似这样的简单表

<div style="width:100%;margin:auto">

![img1](./java解析Excel文件/1.png)

</div>

**代码**

```java
@PostMapping("/importExcel")
public List importExcel(@RequestParam("excelFile") MultipartFile excelFile){
    List<List> returnList=new ArrayList<>();
    try {
        InputStream inputStream=excelFile.getInputStream();
        
        //根据inputStream的类型自动建立 HSSFWorkbook 或 XSSFWorkbook的 Workbook对象
        //其中HSSFWorkbook用来解析xls格式的excel，XSSFWorkbook用来解析xlsx格式的excel
        Workbook workbook=WorkbookFactory.create(inputStream);

        Sheet sheet=workbook.getSheetAt(0);   //获取表格对象
        int rowNum=sheet.getPhysicalNumberOfRows();    //获取表格行数
        int colNum=sheet.getRow(0).getPhysicalNumberOfCells();      //获取表格第一行的列数
        
        //从第二行开始解析
        //由于数据量过多，chrome的DevTools显示不了，所以先来99个
        for(int i=1;i<100;i++){   
            List<Map> tempList=new ArrayList<>();
            Row row=sheet.getRow(i);
            int j=0;
            for(Cell cell:row){
                Map<String,String> tempMap=new HashMap<>();
                if(cell.getCellType().equals(CellType.NUMERIC)){    //数字的获取数字，字符串的获取字符串，不可弄混
                    tempMap.put(sheet.getRow(0).getCell(j).getStringCellValue(),cell.getNumericCellValue()+"");
                }else if(cell.getCellType().equals(CellType.STRING)){
                    tempMap.put(sheet.getRow(0).getCell(j).getStringCellValue(),cell.getStringCellValue());
                }else if(cell.getCellType().equals(CellType.BOOLEAN)){
                    tempMap.put(sheet.getRow(0).getCell(j).getStringCellValue(),String.valueOf(cell.getBooleanCellValue()));
                }
                j++;
                tempList.add(tempMap);
            }
            returnList.add(tempList);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    return returnList;
}

```

**结果**

<div style="width:100%;margin:auto">

![img1](./java解析Excel文件/2.png)

</div>


## 解析复杂表

再来个解析类似这样的较为复杂的表，表里的部分内容为空

<div style="width:100%;margin:auto">

![img1](./java解析Excel文件/3.png)

</div>


```java
Row headerRow=sheet.getRow(0);
Row subheaderRow=sheet.getRow(1);
```

获取表格的第一行和第二行数据，结果如下：

<div style="width:100%;margin:auto">

![img4](./java解析Excel文件/4.png)

</div>

这时候就根据这个来分析表头就好了

**代码**

```java
@PostMapping("/importExcel2")
public List importExcel2(@RequestParam("excelFile") MultipartFile excelFile){
    List<List> returnList=new ArrayList<>();
    try {
        InputStream inputStream=excelFile.getInputStream();

        //根据inputStream的类型自动建立 HSSFWorkbook 或 XSSFWorkbook的 Workbook对象
        //其中HSSFWorkbook用来解析xls格式的excel，XSSFWorkbook用来解析xlsx格式的excel
        Workbook workbook=WorkbookFactory.create(inputStream);
        Sheet sheet=workbook.getSheetAt(0);   //获取表格对象
        int rowNum=sheet.getPhysicalNumberOfRows();    //获取表格行数
        int colNum=sheet.getRow(0).getPhysicalNumberOfCells();      //获取表格第一行的列数

        Row headerRow=sheet.getRow(0);    //获取表格的第一行
        Row subheaderRow=sheet.getRow(1);    //获取表格的第二行

        for(int i=2;i<100;i++) {    //从第三行开始解析
            List<Map> tempList=new ArrayList<>();
            Row row=sheet.getRow(i);
            int headerIndex=0;
            int subheaderIndex=0;
            for(Cell cell:row){
                Map<String,String> tempMap=new HashMap<>();
                String key;
                if(headerIndex==0){
                    key=headerRow.getCell(headerIndex++).getStringCellValue();
                    subheaderIndex++;
                }else if(headerIndex<4){
                    key=headerRow.getCell(1).getStringCellValue()+"-"+subheaderRow.getCell(subheaderIndex++).getStringCellValue();
                    headerIndex++;
                }else if(headerIndex<7){
                    key=headerRow.getCell(4).getStringCellValue()+"-"+subheaderRow.getCell(subheaderIndex++).getStringCellValue();
                    headerIndex++;
                }else if(headerIndex<9){
                    key=headerRow.getCell(7).getStringCellValue()+"-"+subheaderRow.getCell(subheaderIndex++).getStringCellValue();
                    headerIndex++;
                }else{
                    key=headerRow.getCell(headerIndex++).getStringCellValue();
                }

                //数字的获取数字，字符串的获取字符串，空白的取空，不可弄混
                if(cell.getCellType().equals(CellType.NUMERIC)){
                    tempMap.put(key,cell.getNumericCellValue()+"");
                }else if(cell.getCellType().equals(CellType.STRING)){
                    tempMap.put(key,cell.getStringCellValue());
                }else if(cell.getCellType().equals(CellType.BLANK)){
                    tempMap.put(key,"");
                }
                tempList.add(tempMap);
            }
            returnList.add(tempList);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    return returnList;
}

```


**结果**

<div style="width:100%;margin:auto">

![img5](./java解析Excel文件/5.png)

</div>



## 编辑Excel表

**例子一：**

最近要弄一个这样的东西，在这个表中插入几百条随机数据，怎么弄呢？

![img6](D:\blog\source\_posts\java解析Excel文件\6.png)

```java
public void createRandomExcel2(@RequestParam("excelFile") MultipartFile excelFile){
        try {
            InputStream inputStream=excelFile.getInputStream();

            //根据inputStream的类型自动建立 HSSFWorkbook 或 XSSFWorkbook的 Workbook对象
            //其中HSSFWorkbook用来解析xls格式的excel，XSSFWorkbook用来解析xlsx格式的excel
            Workbook workbook= WorkbookFactory.create(inputStream);

            Sheet sheet=workbook.getSheetAt(0);   //获取表格对象
            int rowNum=sheet.getPhysicalNumberOfRows();    //获取表格行数
            int colNum=sheet.getRow(3).getPhysicalNumberOfCells();      //获取表格第一行的列数

            for(int i=4;i<rowNum;i++){       //从第5行开始插入
                Row row=sheet.getRow(i);     
                for(int j=0;j<colNum;j++){
                    switch (j){
                        case 0:{
                            row.getCell(j).setCellValue("海原站-彭阳站");
                            break;
                        }
                        case 1:{
                            row.getCell(j).setCellValue(new BigDecimal(Math.random()*5000).setScale(0,RoundingMode.DOWN).intValue());
                            break;
                        }
                        case 4:{
                            String[] types={"-","杂散电流干扰"};

                            if(Math.random()*10<7.5){
                                row.getCell(j++).setCellValue(types[0]);
                                row.getCell(j).setCellValue("-");
                            }else{
                                row.getCell(j++).setCellValue(types[1]);
                                row.getCell(j).setCellValue("土壤酸碱性");
                            }

                            break;
                        }
                        case 6:{
                            int hh1=new Double(Math.random()*24).intValue();
                            int mm1=new Double(Math.random()*60).intValue();
                            int interval;
                            int repeatTime=1;
                            while(true){
                                interval=new Double(Math.random()*60).intValue();
                                if(mm1+interval<60){
                                    break;
                                }
                                if(repeatTime>10){
                                    mm1=new Double(Math.random()*60).intValue();
                                    repeatTime=1;
                                }
                            }
                            String hour1=hh1<10? "0"+hh1:""+hh1;
                            String minute1=mm1<10? "0"+mm1:""+mm1;
                            row.getCell(j++).setCellValue(hour1+":"+minute1);

                            minute1=(mm1+interval)<10? "0"+(mm1+interval):""+(mm1+interval);
                            row.getCell(j++).setCellValue(hour1+":"+minute1);
                            row.getCell(j).setCellValue(interval);
                            break;
                        }
                        case 10:{
                            double num1=new BigDecimal(Math.random()*100).setScale(2,RoundingMode.DOWN).doubleValue();
                            double num2=new BigDecimal(Math.random()*(100-num1)).setScale(2,RoundingMode.DOWN).doubleValue();
                            double num3=new BigDecimal(Math.random()*(100-num1-num2)).setScale(2,RoundingMode.DOWN).doubleValue();
                            double num4=100-num1-num2-num3;
                            row.getCell(j++).setCellValue(num1);
                            row.getCell(j++).setCellValue(num2);
                            row.getCell(j++).setCellValue(num3);
                            row.getCell(j).setCellValue(num4);
                            break;
                        }
                        case 14:{
                            String[] strs={"强","中","弱"};
                            row.getCell(j).setCellValue(strs[new BigDecimal(Math.random()*3).setScale(0,RoundingMode.DOWN).intValue()]);
                            break;
                        }
                        case 15:{
                            String[] strs={"好","较好","一般","较差","差"};
                            row.getCell(j).setCellValue(strs[new BigDecimal(Math.random()*5).setScale(0,RoundingMode.DOWN).intValue()]);
                            break;
                        }
                        case 16:{
                            row.getCell(j).setCellValue("暂无");
                            break;
                        }
                        case 17:{
                            String month;
                            String day;
                            int MM=new BigDecimal(Math.random()*10).setScale(0,RoundingMode.HALF_DOWN).intValue();
                            int dd=new BigDecimal(Math.random()*30).setScale(0,RoundingMode.HALF_DOWN).intValue();
                            month=MM<10? "0"+MM:""+MM;
                            day=dd<10? "0"+dd:""+dd;
                            row.getCell(j).setCellValue("2020"+month+day);
                            break;
                        }
                        case 18:
                        case 19:
                        case 20:
                        case 21:{
                            row.getCell(j).setCellValue("-");
                            break;
                        }


                    }

                }
            }
            //写入文件
            OutputStream fileOut=new FileOutputStream("C:/Users/15513/Desktop/直流.xlsx");
            workbook.write(fileOut);
        } catch (IOException e) {
            e.printStackTrace();
        }
}
```



**例子二：**

注意，在往Excel表填数据时，需要对Row、Cell给初始化，不然就会报指针为空的错误

```java
public class ExcelAnalyse {

    //解析管道数据
    public List<PipelineDepthData> getExcelAnayseData(File file) {
        List<PipelineDepthData> analyseData = new ArrayList<PipelineDepthData>();
        int i = 1;
        try {
            InputStream inputStream = new FileInputStream(file);
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(3);
            int rowNum = sheet.getPhysicalNumberOfRows();
            
            for (i = 1; i < rowNum; i++) {
                Row row = sheet.getRow(i);
                PipelineDepthData data = new PipelineDepthData();
                //相对起始位置距离（m）
                Cell cell0 = row.getCell(0);
                if (cell0.getCellType().equals(CellType.STRING)) {
                    data.setTestStationId(cell0.getStringCellValue());
                    data.setRelativePosition(0);
                } else {
                    data.setTestStationId(analyseData.get(analyseData.size() - 1).getTestStationId());
                    data.setRelativePosition((int) cell0.getNumericCellValue());
                }
                //埋深（m）
                Cell cell1 = row.getCell(1);
                data.setBuryDepth(cell1.getNumericCellValue());
                //经度
                Cell cell2 = row.getCell(2);
                data.setLatitude(cell2.getNumericCellValue());
                //纬度
                Cell cell3 = row.getCell(3);
                data.setLongtitude(cell3.getNumericCellValue());
                //备注
                Cell cell5 = row.getCell(5);
                data.setRemarks(cell5.getStringCellValue());
                analyseData.add(data);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return analyseData;
    }

    public boolean writeToExcelTemplate(List<PipelineDepthData> excelAnalyseData, File file) {
        try {
            InputStream inputStream = new FileInputStream(file);
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            int colNum=sheet.getRow(1).getPhysicalNumberOfCells();
            for (int i = 0; i < excelAnalyseData.size(); i++) {
                Row row = sheet.getRow(i + 2);
                if(row==null) row=sheet.createRow(i+2);

                for(int j=0;j<colNum;j++){
                    Cell cell=row.getCell(j);
                    if(cell==null) cell=row.createCell(j);
                    switch (j){
                        case 0:{
                            cell.setCellValue((i + 1)+"");
                            break;
                        }
                        case 1:{
                            cell.setCellValue(excelAnalyseData.get(i).getTestStationId());
                            break;
                        }
                        case 3:{
                            cell.setCellValue(excelAnalyseData.get(i).getRelativePosition());
                            break;
                        }
                        case 4:{
                            cell.setCellValue(excelAnalyseData.get(i).getLongtitude());
                            break;
                        }
                        case 5:{
                            cell.setCellValue(excelAnalyseData.get(i).getLatitude());
                            break;
                        }
                        case 6:{
                            cell.setCellValue(excelAnalyseData.get(i).getBuryDepth());
                            break;
                        }
                        case 9:{
                            if (excelAnalyseData.get(i).getRemarks() == null || excelAnalyseData.get(i).getRemarks().length()==0) {
                                cell.setBlank();
                            } else {
                                cell.setCellValue(excelAnalyseData.get(i).getRemarks());
                            }
                            break;
                        }
                        case 2:
                        case 7:
                        case 8:{
                            cell.setBlank();
                            break;
                        }
                    }
                }
            }

            OutputStream outputStream = new FileOutputStream(file);
            workbook.write(outputStream);
            return true;

        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void main(String[] args) {
        ExcelAnalyse excelAnalyse = new ExcelAnalyse();
        File dataFile = new File("西三线吉安-瑞金段管道外检测项目检测报告附件1-8(修改版).xlsx");
        List<PipelineDepthData> excelAnayseData = excelAnalyse.getExcelAnayseData(dataFile);
        File targetFile=new File("管线埋深数据表.xlsx");
        System.out.println(excelAnalyse.writeToExcelTemplate(excelAnayseData, targetFile));
    }
}
```



<br/>

<br/>

站在巨人的肩膀上

