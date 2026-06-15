package com.rsm.tiffin.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.rsm.tiffin.dto.AttendanceResponse;
import com.rsm.tiffin.dto.UserResponse;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfReportUtil {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font BODY_FONT = new Font(Font.FontFamily.HELVETICA, 10);

    public byte[] generateStudentsReport(List<UserResponse> students) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Paragraph title = new Paragraph("Students Report", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        addTableHeader(table, "ID", "Full Name", "Email", "Mobile", "Aadhaar", "Status");

        for (UserResponse student : students) {
            table.addCell(cell(student.getId().toString()));
            table.addCell(cell(student.getFullName()));
            table.addCell(cell(student.getEmail()));
            table.addCell(cell(student.getMobileNumber()));
            table.addCell(cell(student.getAadhaarNumber() != null ? student.getAadhaarNumber() : "-"));
            table.addCell(cell(student.getStatus().name()));
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    public byte[] generateAttendanceReport(List<AttendanceResponse> attendanceList) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Paragraph title = new Paragraph("Attendance Report", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        addTableHeader(table, "ID", "Student Name", "Date", "Status");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        for (AttendanceResponse att : attendanceList) {
            table.addCell(cell(att.getId().toString()));
            table.addCell(cell(att.getStudentName()));
            table.addCell(cell(att.getAttendanceDate().format(formatter)));
            table.addCell(cell(att.getStatus().name()));
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, HEADER_FONT));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(5);
            table.addCell(cell);
        }
        table.setHeaderRows(1);
    }

    private PdfPCell cell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, BODY_FONT));
        cell.setPadding(5);
        return cell;
    }
}
