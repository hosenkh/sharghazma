save function
socket
gulp
verify permission logic
search in a column by a keyword
remove datatypes table

SELECT e.MemberID
FROM Entry e
WHERE e.TourID IN
 (SELECT t.TourID
 FROM Tournament t
 WHERE t.TourType = 'Open')
